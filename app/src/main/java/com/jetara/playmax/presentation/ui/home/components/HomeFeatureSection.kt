package com.jetara.playmax.presentation.ui.home.components

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.unit.dp
import androidx.tv.material3.Text
import com.jetara.playmax.R
import com.jetara.playmax.app.theme.onSurface
import com.jetara.playmax.app.theme.surface
import com.jetara.playmax.core.component.button.OnSurfaceButton
import com.jetara.playmax.domain.model.Movie

@Composable
fun HomeFeatureSection(
    modifier: Modifier = Modifier,
    movie: Movie,
    onPlayNowClick: (Movie) -> Unit,
    onShowDetailsClick: (Movie) -> Unit
) {
    val gradientColors = listOf(surface, surface.copy(.5f))
    val horizontalGradientBrush = Brush.horizontalGradient(
        colors = gradientColors,

        )

    Box(modifier) {
        movie.thumbnail?.let {
            Image(
                bitmap = it.asImageBitmap(),
                contentDescription = movie.title,
                modifier = Modifier.fillMaxWidth(),
                contentScale = ContentScale.Crop
            )
        }
        Column(
            verticalArrangement = Arrangement.Bottom,
            modifier = Modifier
                .fillMaxWidth()
                .matchParentSize()
                .background(horizontalGradientBrush)
        ) {
            Text(
                text = movie.title,
                style = MaterialTheme.typography.titleLarge.copy(color = onSurface),
                modifier = Modifier.fillMaxWidth(.5f).padding(horizontal = 10.dp)
            )
            ButtonsSection(
                modifier = Modifier.padding(10.dp),
                onPlayNowClick = { onPlayNowClick(movie) },
                onShowDetailsClick = { onShowDetailsClick(movie) }
            )
        }
    }
}

@Composable
private fun ButtonsSection(
    modifier: Modifier = Modifier,
    onPlayNowClick: () -> Unit,
    onShowDetailsClick: () -> Unit
) {
    Row(modifier) {
        OnSurfaceButton(
            modifier = modifier,
            textRes = R.string.play_now,
            onClick = onPlayNowClick
        )
        Spacer(Modifier.width(10.dp))
        OnSurfaceButton(
            modifier = modifier,
            textRes = R.string.show_details,
            onClick = onShowDetailsClick
        )
    }
}
