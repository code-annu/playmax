package com.jetara.playmax.presentation.ui.player.components

import android.util.Log
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.tv.material3.MaterialTheme
import androidx.tv.material3.Text
import com.jetara.playmax.app.theme.onSurface
import com.jetara.playmax.util.TimeFormatUtil

@Composable
fun PlayerControllerBottomSection(
    currentPosition: Long,
    duration: Long,
    onSeek: (Long) -> Unit,
    modifier: Modifier = Modifier
) {
    Column(modifier = modifier.padding(horizontal = 16.dp)) {
        PlayerSeekbar(
            value = currentPosition.coerceIn(0L, duration).toFloat(),
            valueRange = 0f..duration.toFloat(),
            onValueChange = { newValue ->
                Log.d("ControllerBottomSection", "onValueChange: $newValue")
                onSeek(newValue.toLong())
            },
            modifier = Modifier.fillMaxWidth()
        )
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text(
                text = TimeFormatUtil.formatMillisecondsToHMS(currentPosition),
                style = MaterialTheme.typography.titleLarge.copy(color = onSurface)
            )
            Text(
                text = TimeFormatUtil.formatMillisecondsToHMS(duration),
                style = MaterialTheme.typography.titleLarge.copy(color = onSurface)
            )
        }
    }
}



