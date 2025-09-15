package com.jetara.playmax.presentation.ui.media

import android.util.Log
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsFocusedAsState
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.ImageBitmap
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import androidx.tv.material3.MaterialTheme
import androidx.tv.material3.Text
import com.jetara.playmax.R
import com.jetara.playmax.app.navigation.AppRoute
import com.jetara.playmax.app.theme.onSurface
import com.jetara.playmax.app.theme.surface
import com.jetara.playmax.core.component.button.OnSurfaceButton
import com.jetara.playmax.domain.model.Movie
import com.jetara.playmax.presentation.viewmodel.MovieViewModel


@Composable
fun MovieDetailScreen(
    modifier: Modifier = Modifier,
    bucketId: Int,
    videoId: Long,
    videoViewModel: MovieViewModel,
    navController: NavController
) {
    var videoFile by remember { mutableStateOf<Movie?>(null) }
    val verticalState = rememberScrollState()

    LaunchedEffect(true) {
        Log.i("MovieDetailScreen", "LaunchedEffect: $bucketId, $videoId")
        videoFile = videoViewModel.getMovieFromBucket(bucketId, videoId)
    }

    videoFile?.let {
        Column(modifier.verticalScroll(verticalState)) {
            it.thumbnail?.let { thumbnail ->
                VideoPosterSection(
                    modifier = Modifier.fillMaxWidth(),
                    thumbnail = thumbnail.asImageBitmap(),
                    movieTitle = it.title,
                    onPlayNow = {
                        navController.navigate(
                            AppRoute.MediaPlayer(
                                bucketId = bucketId,
                                mediaId = it.id
                            )
                        )
                    }
                )
            }
            VideoDescription(modifier = Modifier.padding(horizontal = 10.dp), description = it.description)

            VideoCast(cast = it.cast)
            OnSurfaceButton(textRes = R.string.play_now) { }

        }
    }


}

@Composable
fun VideoPosterSection(
    modifier: Modifier = Modifier,
    thumbnail: ImageBitmap,
    movieTitle: String,
    onPlayNow: () -> Unit
) {
    Box(
        modifier = modifier
            .fillMaxWidth()
            .aspectRatio(16f / 9f)  // or whatever aspect ratio you want
    ) {
        Image(
            bitmap = thumbnail,
            contentDescription = "Video poster",
            contentScale = ContentScale.Crop,
            modifier = Modifier
                .fillMaxSize()
        )
        // Semi-transparent overlay
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(surface.copy(alpha = 0.5f))
        )

        Column(
            modifier = Modifier
                .background(Color.Transparent)
                .fillMaxWidth(.5f)
                .align(Alignment.BottomStart)
                .padding(horizontal = 24.dp, vertical = 15.dp)
        ) {
            // Title
            Text(
                text = movieTitle,
                style = MaterialTheme.typography.titleLarge.copy(color = onSurface),
                modifier = Modifier
                    .padding(bottom = 14.dp) // space between title and button
            )

            // Play Now button
            OnSurfaceButton(
                textRes = R.string.play_now,
                onClick = onPlayNow,
                modifier = Modifier.fillMaxWidth(.5f)
            )
        }
    }
}


@Composable
private fun VideoDescription(modifier: Modifier = Modifier, description: String) {

    val interactionSource = remember { MutableInteractionSource() }
    val isFocused by interactionSource.collectIsFocusedAsState()
    Text(
        text = description,
        modifier = modifier,
        style = MaterialTheme.typography.bodyLarge.copy(color = onSurface)
    )
}

@Composable
private fun VideoCast(modifier: Modifier = Modifier, cast: List<String>) {
    Text(
        text = "Cast: ${cast.joinToString(", ")}",
        modifier = modifier,
        style = MaterialTheme.typography.labelLarge.copy(color = onSurface)
    )
}
