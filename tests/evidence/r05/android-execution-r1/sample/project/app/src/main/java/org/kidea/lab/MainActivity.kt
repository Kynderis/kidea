package org.kidea.lab

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.produceState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.unit.dp
import androidx.lifecycle.ViewModel
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.repeatOnLifecycle
import androidx.lifecycle.viewModelScope
import androidx.lifecycle.viewmodel.compose.viewModel
import kotlinx.coroutines.Dispatchers

class LabViewModel : ViewModel() {
    val controller = LabController(viewModelScope, Dispatchers.IO, object : Repository {
        override suspend fun load(identity: Identity) = "Sample workshop"
        override suspend fun submit(intent: Intent) = Outcome.UNKNOWN
        override suspend fun lookup(intent: Intent) = Outcome.SUCCESS
    }).also { it.switchActor(Identity("sample-participant", 1, "workshop-1")); it.load() }
    override fun onCleared() { controller.close() }
}
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            val model: LabViewModel = viewModel()
            val state by produceState(initialValue = model.controller.snapshot(), model) {
                lifecycle.repeatOnLifecycle(Lifecycle.State.STARTED) {
                    model.controller.state.collect { value = it }
                }
            }
            Column(Modifier.padding(24.dp)) {
                BasicText(state.title.ifEmpty { stringResource(R.string.sample_title) })
                val intent = state.intent
                if (intent == null) {
                    BasicText(stringResource(R.string.join), Modifier.padding(16.dp).clickable(role = Role.Button) { model.controller.submit() })
                } else {
                    BasicText(stringResource(if (intent.outcome == Outcome.UNKNOWN) R.string.result_unknown else R.string.result_confirmed))
                    if (intent.outcome == Outcome.UNKNOWN) {
                        BasicText(stringResource(R.string.check_result), Modifier.padding(16.dp).clickable(role = Role.Button) { model.controller.reconcile() })
                    }
                }
            }
        }
    }
}
