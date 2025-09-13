@file:OptIn(ExperimentalMaterial3Api::class)

package com.jetara.playmax.presentation.ui.player.components

import androidx.compose.foundation.background
import androidx.compose.foundation.focusable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Slider
import androidx.compose.material3.SliderDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.onFocusChanged
import androidx.compose.ui.input.key.Key
import androidx.compose.ui.input.key.KeyEventType
import androidx.compose.ui.input.key.key
import androidx.compose.ui.input.key.onPreviewKeyEvent
import androidx.compose.ui.input.key.type
import androidx.compose.ui.unit.dp
import com.jetara.playmax.app.theme.onSurface


@Composable
fun PlayerSeekbar(
    modifier: Modifier = Modifier,
    value: Float,
    valueRange: ClosedFloatingPointRange<Float>,
    onValueChange: (Float) -> Unit,
    onFocusChanged: (Boolean) -> Unit = {}
) {
    var isFocused by remember { mutableStateOf(false) }

    Slider(
        value = value,
        onValueChange = onValueChange,
        valueRange = valueRange,
        modifier = modifier
            .onFocusChanged {
                isFocused = it.isFocused
                onFocusChanged(isFocused)
            }
            .focusable()
            .onPreviewKeyEvent { keyEvent ->
                if (keyEvent.type == KeyEventType.KeyUp) {
                    when (keyEvent.key) {
                        Key.DirectionRight -> {
                            onValueChange(
                                (value + 10_000f).coerceAtMost(valueRange.endInclusive)
                            )
                            true
                        }

                        Key.DirectionLeft -> {
                            onValueChange(
                                (value - 10_000f).coerceAtLeast(valueRange.start)
                            )
                            true
                        }

                        else -> false
                    }
                } else false
            },
        colors = SliderDefaults.colors(
            thumbColor = onSurface,
            activeTrackColor = onSurface,
            inactiveTrackColor = onSurface.copy(alpha = .3f),
        ),
        track = { positions ->
            SliderDefaults.Track(
                sliderState = positions,
                modifier = Modifier.height(if (isFocused) 10.dp else 5.dp),
                thumbTrackGapSize = 0.dp,
                colors = SliderDefaults.colors(
                    thumbColor = onSurface,
                    activeTrackColor = onSurface,
                    inactiveTrackColor = onSurface.copy(alpha = .3f),
                )
            )
        },
        thumb = {
            if (isFocused) {
                Box(
                    Modifier
                        .size(22.dp)
                        .background(onSurface, shape = CircleShape)
                )
            }
        }
    )
}
