@file:OptIn(ExperimentalMaterial3Api::class)

package com.jetara.playmax.presentation.ui.player

import androidx.compose.foundation.focusable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.input.key.Key
import androidx.compose.ui.input.key.KeyEventType
import androidx.compose.ui.input.key.key
import androidx.compose.ui.input.key.onKeyEvent
import androidx.compose.ui.input.key.type
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.Dp
import androidx.media3.common.MediaItem
import androidx.media3.exoplayer.ExoPlayer
import androidx.media3.ui.compose.PlayerSurface
import com.jetara.playmax.presentation.ui.player.components.PlayerController
import com.jetara.playmax.presentation.viewmodel.MovieViewModel
import kotlinx.coroutines.launch

@Composable
fun PlayerScreen(
    modifier: Modifier = Modifier, bucketId: Int, movieId: Long, movieViewModel: MovieViewModel
) {
    val context = LocalContext.current
    val exoPlayer = remember {
        ExoPlayer.Builder(context).build().apply {
            val movie = movieViewModel.getMovieFromBucket(bucketId, movieId)
            movie?.let {
                setMediaItem(MediaItem.fromUri(it.uri))

            }
            prepare()
            play()
        }
    }

    val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)
    val scope = rememberCoroutineScope()
    var showControls by remember { mutableStateOf(true) }

    Box(modifier = modifier.fillMaxSize()) {
        PlayerSurface(
            player = exoPlayer,
            modifier = Modifier
                .matchParentSize()
                .focusable(true)
                .onKeyEvent { keyEvent ->
                    if (keyEvent.type == KeyEventType.KeyUp && (keyEvent.key == Key.Enter || keyEvent.key == Key.DirectionCenter)) {
                        showControls = true
                        true
                    } else false
                })
    }

    if (showControls) {
        ModalBottomSheet(
            onDismissRequest = {
                scope.launch {
                    sheetState.hide()
                }.invokeOnCompletion { showControls = false }
            },
            sheetState = sheetState,
            scrimColor = Color.Black.copy(alpha = 0.5f),
            containerColor = Color.Transparent,
            sheetMaxWidth = Dp.Unspecified,
            dragHandle = {}) {
            PlayerController(exoPlayer = exoPlayer, modifier = Modifier.fillMaxSize())
        }

        LaunchedEffect(Unit) {
            scope.launch { sheetState.show() }
        }
    }

}