package org.kidea.lab

import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.CoroutineDispatcher
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Job
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

data class Identity(val actor: String, val epoch: Long, val workshop: String)
data class Ticket(val identity: Identity, val generation: Long)
enum class Outcome { UNKNOWN, SUCCESS }
data class Intent(val id: String, val identity: Identity, val outcome: Outcome)
data class UiState(val identity: Identity? = null, val title: String = "", val intent: Intent? = null)
interface Repository {
    suspend fun load(identity: Identity): String
    suspend fun submit(intent: Intent): Outcome
    suspend fun lookup(intent: Intent): Outcome
}

class LabController(parent: CoroutineScope, private val io: CoroutineDispatcher, private val repository: Repository) {
    private val owner = SupervisorJob(parent.coroutineContext[Job])
    private val scope = CoroutineScope(parent.coroutineContext + owner)
    private val mutable = MutableStateFlow(UiState())
    val state: StateFlow<UiState> = mutable.asStateFlow()
    private var generation = 0L
    private var serial = 0L
    private var loadJob: Job? = null
    private val cache = mutableMapOf<Identity, String>()

    private fun key(identity: Identity): Identity = identity
    fun cached(identity: Identity): String? = cache[key(identity)]
    fun snapshot(): UiState = mutable.value
    fun switchActor(identity: Identity?): Ticket? {
        loadJob?.cancel()
        generation += 1
        mutable.value = UiState(identity = identity)
        return identity?.let { Ticket(it, generation) }
    }
    fun acceptResponse(ticket: Ticket, value: String) {
        if (!owner.isActive || ticket.generation != generation || ticket.identity != mutable.value.identity) return
        cache[key(ticket.identity)] = value
        mutable.value = mutable.value.copy(title = value)
    }
    fun load(): Job? {
        val identity = mutable.value.identity ?: return null
        val ticket = Ticket(identity, generation)
        loadJob?.cancel()
        return scope.launch {
            try {
                val value = withContext(io) { repository.load(identity) }
                acceptResponse(ticket, value)
            } catch (cancelled: CancellationException) {
                throw cancelled
            }
        }.also { loadJob = it }
    }
    fun submit(): Job? {
        val identity = mutable.value.identity ?: return null
        if (mutable.value.intent != null) return null
        val ticket = Ticket(identity, generation)
        val intent = Intent("intent-${++serial}", identity, Outcome.UNKNOWN)
        mutable.value = mutable.value.copy(intent = intent)
        return scope.launch {
            val outcome = withContext(io) { repository.submit(intent) }
            if (owner.isActive && ticket.generation == generation && identity == mutable.value.identity) {
                mutable.value = mutable.value.copy(intent = intent.copy(outcome = outcome))
            }
        }
    }
    fun reconcile(): Job? {
        val intent = mutable.value.intent ?: return null
        if (intent.outcome != Outcome.UNKNOWN) return null
        val ticket = Ticket(intent.identity, generation)
        val sameIntent = intent
        return scope.launch {
            val outcome = withContext(io) { repository.lookup(sameIntent) }
            if (owner.isActive && ticket.generation == generation && intent.identity == mutable.value.identity) {
                mutable.value = mutable.value.copy(intent = sameIntent.copy(outcome = outcome))
            }
        }
    }
    fun close() {
        owner.cancel()
    }
}

fun decodeVersion(raw: String): ULong? =
    if (raw.matches(Regex("0|[1-9][0-9]*"))) raw.toULongOrNull() else null
