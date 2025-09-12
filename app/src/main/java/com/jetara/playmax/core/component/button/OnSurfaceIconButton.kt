package com.jetara.playmax.core.component.button

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsFocusedAsState
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.scale
import androidx.compose.ui.res.painterResource
import androidx.tv.material3.ButtonDefaults
import androidx.tv.material3.Icon
import androidx.tv.material3.IconButton
import androidx.tv.material3.IconButtonDefaults
import com.jetara.playmax.app.theme.AppShapes
import com.jetara.playmax.app.theme.onSurface
import com.jetara.playmax.app.theme.surface

@Composable
fun OnSurfaceIconButton(
    modifier: Modifier = Modifier,
    iconRes: Int,
    contentDescription: String? = null,
    enabled: Boolean = true,
    onFocusChanged: (Boolean) -> Unit = {},
    onClick: () -> Unit
) {
    val interactionSource = remember { MutableInteractionSource() }
    val isFocused by interactionSource.collectIsFocusedAsState()
    val isPressed by interactionSource.collectIsPressedAsState()

    val targetScale = when {
        isPressed -> 1.1f
        isFocused -> 1.1f
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

    IconButton(
        modifier = modifier
            .scale(scale)
            .then(Modifier),
        onClick = onClick,
        enabled = enabled,
        colors = IconButtonDefaults.colors(
            containerColor = containerColor,
            contentColor = contentColor,
        ),
        shape = ButtonDefaults.shape(
            shape = AppShapes.small
        ),
        interactionSource = interactionSource
    ) {
        Icon(
            painter = painterResource(id = iconRes),
            contentDescription = contentDescription
        )
    }

}