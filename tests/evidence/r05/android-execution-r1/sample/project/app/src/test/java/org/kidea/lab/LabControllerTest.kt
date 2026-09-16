package org.kidea.lab

import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.CompletableDeferred
import kotlinx.coroutines.CoroutineDispatcher
import kotlin.coroutines.CoroutineContext
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.cancelChildren
import kotlinx.coroutines.test.TestScope
import kotlinx.coroutines.test.StandardTestDispatcher
import kotlinx.coroutines.test.runTest
import kotlinx.coroutines.test.runCurrent
import kotlinx.coroutines.test.advanceUntilIdle
import org.junit.Assert.*
import org.junit.Test

@OptIn(ExperimentalCoroutinesApi::class)
class LabControllerTest {
    private fun labTest(block: suspend TestScope.() -> Unit) = runTest {
        try { block() } finally { coroutineContext.cancelChildren() }
    }
    private val a = Identity("A", 1, "W1")
    private val b = Identity("B", 1, "W1")
    private class Fake : Repository {
        var submitted = mutableListOf<Intent>()
        var lookedUp = mutableListOf<Intent>()
        var pending: CompletableDeferred<String>? = null
        var activeLoads = 0
        var throwCancellation = false
        override suspend fun load(identity: Identity): String {
            activeLoads++
            try {
                if (throwCancellation) throw CancellationException("repository cancelled")
                return pending?.await() ?: "private-${identity.actor}"
            } finally { activeLoads-- }
        }
        override suspend fun submit(intent: Intent): Outcome { submitted.add(intent); return Outcome.UNKNOWN }
        override suspend fun lookup(intent: Intent): Outcome { lookedUp.add(intent); return Outcome.SUCCESS }
    }
    @Test fun staleGenerationCannotReplaceNewerData() = labTest {
        val model = LabController(this, StandardTestDispatcher(testScheduler), Fake())
        val old = model.switchActor(a)!!
        val current = model.switchActor(a)!!
        model.acceptResponse(current, "current")
        model.acceptResponse(old, "stale")
        assertEquals("current", model.snapshot().title)
        model.close()
    }
    @Test fun logoutAndActorSwitchRejectLateCallbacks() = labTest {
        val model = LabController(this, StandardTestDispatcher(testScheduler), Fake())
        val old = model.switchActor(a)!!
        model.switchActor(b)
        model.acceptResponse(old, "private-A")
        assertEquals("", model.snapshot().title)
        model.switchActor(null)
        model.acceptResponse(old, "private-A")
        assertNull(model.snapshot().identity)
        assertEquals("", model.snapshot().title)
        model.close()
    }
    @Test fun closingOwnerCancelsSuspendedWork() = labTest {
        val fake = Fake().apply { pending = CompletableDeferred() }
        val parent = CoroutineScope(SupervisorJob() + StandardTestDispatcher(testScheduler))
        val model = LabController(parent, StandardTestDispatcher(testScheduler), fake)
        try {
            model.switchActor(a); val job = model.load()!!; runCurrent()
            assertEquals(1, fake.activeLoads)
            model.close(); runCurrent()
            assertTrue(job.isCancelled); assertEquals(0, fake.activeLoads)
        } finally { parent.cancel(); fake.pending!!.cancel() }
    }
    @Test fun readingStateNeverSubmitsAndIntentIsSingle() = labTest {
        val fake = Fake(); val model = LabController(this, StandardTestDispatcher(testScheduler), fake)
        model.switchActor(a)
        repeat(20) { model.snapshot() }; runCurrent(); assertEquals(0, fake.submitted.size)
        model.submit(); model.submit(); advanceUntilIdle(); assertEquals(1, fake.submitted.size)
        repeat(20) { model.snapshot() }; runCurrent(); assertEquals(1, fake.submitted.size)
        model.close()
    }
    @Test fun cacheSeparatesActorEpochAndWorkshop() = labTest {
        val model = LabController(this, StandardTestDispatcher(testScheduler), Fake())
        for (identity in listOf(a, b, a.copy(epoch = 2), a.copy(workshop = "W2"))) {
            model.acceptResponse(model.switchActor(identity)!!, identity.toString())
        }
        for (identity in listOf(a, b, a.copy(epoch = 2), a.copy(workshop = "W2"))) assertEquals(identity.toString(), model.cached(identity))
        model.close()
    }
    @Test fun cacheSeparatesIdentitiesContainingDelimiters() = labTest {
        val model = LabController(this, StandardTestDispatcher(testScheduler), Fake())
        val identities = listOf(Identity("A", 1, "B:2:C"), Identity("A:1:B", 2, "C"))
        for (identity in identities) model.acceptResponse(model.switchActor(identity)!!, identity.toString())
        for (identity in identities) assertEquals(identity.toString(), model.cached(identity))
        model.close()
    }
    @Test fun versionsAreExactAndOverflowRejected() {
        assertEquals(9007199254740993uL, decodeVersion("9007199254740993"))
        assertEquals(ULong.MAX_VALUE, decodeVersion("18446744073709551615"))
        for (raw in listOf("18446744073709551616", "-1", "+1", "1.0", "1e2", "01", "", " 1")) assertNull(raw, decodeVersion(raw))
    }
    @Test fun unknownReconciliationKeepsIntentAndDoesNotResubmit() = labTest {
        val fake = Fake(); val model = LabController(this, StandardTestDispatcher(testScheduler), fake)
        model.switchActor(a); model.submit(); advanceUntilIdle()
        val original = model.snapshot().intent!!
        assertEquals(Outcome.UNKNOWN, original.outcome)
        model.reconcile(); advanceUntilIdle()
        assertEquals(listOf(original), fake.lookedUp)
        assertEquals(1, fake.submitted.size)
        assertEquals(original.id, model.snapshot().intent!!.id)
        assertEquals(Outcome.SUCCESS, model.snapshot().intent!!.outcome)
        model.close()
    }
    @Test fun cancellationDoesNotPublishFallbackState() = labTest {
        val fake = Fake().apply { throwCancellation = true }
        val model = LabController(this, StandardTestDispatcher(testScheduler), fake)
        model.switchActor(a); val job = model.load()!!; advanceUntilIdle()
        assertTrue(job.isCancelled); assertEquals("", model.snapshot().title)
        model.close()
    }
    @Test fun workUsesInjectedDispatcher() = labTest {
        val fake = Fake(); val delegate = StandardTestDispatcher(testScheduler)
        var ioDispatches = 0
        val io = object : CoroutineDispatcher() {
            override fun dispatch(context: CoroutineContext, block: Runnable) {
                ioDispatches++
                delegate.dispatch(context, block)
            }
        }
        val model = LabController(this, io, fake)
        model.switchActor(a); model.load()
        assertEquals("", model.snapshot().title)
        advanceUntilIdle(); assertEquals("private-A", model.snapshot().title)
        assertTrue("Injected IO dispatcher must execute repository work", ioDispatches > 0)
        model.close()
    }
    @Test fun closedOwnerRejectsCallback() = labTest {
        val model = LabController(this, StandardTestDispatcher(testScheduler), Fake())
        val ticket = model.switchActor(a)!!; model.close(); model.acceptResponse(ticket, "late")
        assertEquals("", model.snapshot().title)
    }
}
