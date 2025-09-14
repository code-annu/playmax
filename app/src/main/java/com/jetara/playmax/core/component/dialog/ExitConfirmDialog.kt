package com.jetara.playmax.core.component.dialog

import androidx.compose.material3.AlertDialog
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.tv.material3.Text
import com.jetara.playmax.R
import com.jetara.playmax.app.theme.surface
import com.jetara.playmax.core.component.button.OnSurfaceButton
import com.jetara.playmax.core.component.input.TextInputField

@Composable
fun ExitConfirmationDialog(
    onConfirmExit: () -> Unit,
    onDismiss: () -> Unit,
    modifier: Modifier = Modifier
) {
    var adminPassword by remember { mutableStateOf("") }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Text(text = "Exit App")
        },
        text = {
            TextInputField(
                value = adminPassword,
                onValueChange = { adminPassword = it },
                label = "Admin Password"
            )
        },
        confirmButton = {
            OnSurfaceButton(
                textRes = R.string.exit_txt,
            ){
                if (adminPassword == "password") {
                    onConfirmExit()
                } else {
                    adminPassword = ""
                }
            }
        },
        dismissButton = {
            OnSurfaceButton(
                textRes = R.string.cancel_txt,
                onClick = onDismiss
            )
        },
        modifier = modifier,
        containerColor = surface
    )
}