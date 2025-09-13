package com.jetara.playmax.presentation.ui.player.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.media3.exoplayer.ExoPlayer
import com.jetara.playmax.R
import com.jetara.playmax.core.component.button.OnSurfaceIconButton


@Composable
fun PlayerControllerMiddleSection(
    modifier: Modifier = Modifier,
    exoPlayer: ExoPlayer,
    isPlaying: Boolean
) {
    Row(
        horizontalArrangement = Arrangement.Center,
        verticalAlignment = Alignment.CenterVertically,
        modifier = modifier
    ) {
        OnSurfaceIconButton (
            modifier = Modifier.size(50.dp),
            iconRes = R.drawable.ic_replay_10
        ) {
            exoPlayer.seekTo((exoPlayer.currentPosition - 10_000).coerceAtLeast(0L))
        }
        Spacer(modifier = Modifier.width(36.dp))
        OnSurfaceIconButton(
            modifier = Modifier.size(50.dp),
            iconRes = if (isPlaying) R.drawable.ic_pause else R.drawable.ic_play_arrow
        ) {
            if (isPlaying) exoPlayer.pause() else exoPlayer.play()
        }
        Spacer(modifier = Modifier.width(32.dp))
        OnSurfaceIconButton (
            modifier = Modifier.size(50.dp),
            iconRes = R.drawable.ic_forward_10,
            onClick = {
                exoPlayer.seekTo(
                    (exoPlayer.currentPosition + 10_000).coerceAtMost(exoPlayer.duration)
                )
            }
        )
    }
}