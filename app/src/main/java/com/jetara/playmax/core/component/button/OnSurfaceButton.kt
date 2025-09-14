package com.jetara.playmax.core.component.button

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.foundation.focusable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsFocusedAsState
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.scale
import androidx.compose.ui.res.stringResource
import androidx.tv.material3.Button
import androidx.tv.material3.ButtonDefaults
import androidx.tv.material3.MaterialTheme
import androidx.tv.material3.Text
import com.jetara.playmax.app.theme.AppShapes
import com.jetara.playmax.app.theme.onSurface
import com.jetara.playmax.app.theme.primary
import com.jetara.playmax.app.theme.surface

@Composable
fun OnSurfaceButton(
    modifier: Modifier = Modifier,
    textRes: Int,
    enabled: Boolean = true,
    onFocusChanged: (Boolean) -> Unit = {},
    onClick: () -> Unit,
) {

    val interactionSource = remember { MutableInteractionSource() }
    val isFocused by interactionSource.collectIsFocusedAsState()
    val isPressed by interactionSource.collectIsPressedAsState()

    val targetScale = when {
        isPressed -> 1.0f
        isFocused -> 1.05f
        else -> 1.0f
    }

    val containerColor = when {
        isPressed -> onSurface.copy(.8f)
        isFocused -> onSurface
        else -> onSurface.copy(.5f)
    }

    val contentColor = when {
        isPressed -> surface
        isFocused -> surface
        else -> onSurface
    }

    val scale by animateFloatAsState(targetValue = targetScale)

    Button(
        modifier = modifier
            .scale(scale)
//            .focusable(true)
            .then(Modifier),
        onClick = onClick,
        enabled = enabled,
        colors = ButtonDefaults.colors(
            containerColor = containerColor,
            contentColor = contentColor,
        ), shape = ButtonDefaults.shape(
            shape = AppShapes.small
        ),
        interactionSource = interactionSource
    ) {
        Text(
            text = stringResource(id = textRes),
            style = MaterialTheme.typography.labelLarge
        )

    }
}