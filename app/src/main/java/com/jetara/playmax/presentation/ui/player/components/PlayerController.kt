package com.jetara.playmax.presentation.ui.player.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableLongStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.unit.dp
import androidx.media3.common.Player
import androidx.media3.exoplayer.ExoPlayer
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.NonCancellable.isActive
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

@Composable
fun PlayerController(
    exoPlayer: ExoPlayer,
    modifier: Modifier = Modifier
) {
    var currentPosition by remember { mutableLongStateOf(0) }
    var duration by remember { mutableLongStateOf(0) }
    var isPlaying by remember { mutableStateOf(exoPlayer.isPlaying) }

    DisposableEffect(exoPlayer) {
        val listener = object : Player.Listener {
            override fun onIsPlayingChanged(playing: Boolean) {
                isPlaying = playing
            }

            override fun onPlaybackStateChanged(playbackState: Int) {
                if (playbackState == Player.STATE_READY) {
                    duration = exoPlayer.duration.coerceAtLeast(0L)
                }
            }
        }
        exoPlayer.addListener(listener)

        val job = CoroutineScope(Dispatchers.Main).launch {
            while (isActive) {
                currentPosition = exoPlayer.currentPosition
                delay(500)
            }
        }

        onDispose {
            exoPlayer.removeListener(listener)
            job.cancel()
        }
    }

    val playPauseFocusRequester = remember { FocusRequester() }
    LaunchedEffect(Unit) {
        playPauseFocusRequester.requestFocus()
        duration = exoPlayer.duration
    }

    Column(
        modifier = modifier
            .fillMaxWidth()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.SpaceEvenly
    ) {
        Spacer(modifier = Modifier.height(16.dp))

        // Controls row
        PlayerControllerMiddleSection(
            modifier = Modifier.fillMaxWidth(),
            exoPlayer = exoPlayer,
            isPlaying = isPlaying
        )

        Spacer(modifier = Modifier.height(16.dp))

        if (duration > 0) {
            PlayerControllerBottomSection(
                currentPosition = currentPosition,
                duration = duration,
                onSeek = { pos ->
                    currentPosition = pos
                    exoPlayer.seekTo(currentPosition)
                },
                modifier = Modifier.fillMaxWidth()
            )
        }
    }
}