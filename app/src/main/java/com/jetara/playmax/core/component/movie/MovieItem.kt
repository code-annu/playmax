package com.jetara.playmax.core.component.movie

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Image
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsFocusedAsState
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.unit.dp
import androidx.tv.material3.Border
import androidx.tv.material3.Card
import androidx.tv.material3.CardDefaults
import androidx.tv.material3.MaterialTheme
import androidx.tv.material3.Text
import com.jetara.playmax.app.theme.AppShapes
import com.jetara.playmax.app.theme.onSurface
import com.jetara.playmax.domain.model.Movie

@Composable
fun MovieItem(
    modifier: Modifier = Modifier,
    movie: Movie,
    onFocusChanged: ((Boolean, Movie) -> Unit)? = null,
    onClick: (Movie) -> Unit
) {

    val interactionSource = remember { MutableInteractionSource() }
    val isFocused by interactionSource.collectIsFocusedAsState()
    val isPressed by interactionSource.collectIsPressedAsState()

    val targetScale = when {
        isPressed -> 0.95f
        isFocused -> 1.05f
        else -> 1.0f
    }

    val scale by animateFloatAsState(targetScale)
    val focusedBorder = BorderStroke(width = 3.dp, onSurface)

    Card(
        modifier = modifier
            .scale(scale),
        onClick = { onClick(movie) },
        shape = CardDefaults.shape(
            AppShapes.small
        ),
        colors = CardDefaults.colors(
            containerColor = Color.Transparent,
        ),
        border = CardDefaults.border(
            border = Border.None,
            focusedBorder = Border(focusedBorder),
            pressedBorder = Border(focusedBorder)
        ),
        interactionSource = interactionSource
    ) {
        Column {
            movie.thumbnail?.let {
                Image(
                    bitmap = it.asImageBitmap(),
                    contentDescription = movie.title,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier.fillMaxWidth()
                )
            }
            Text(
                text = movie.title,
                style = MaterialTheme.typography.titleLarge.copy(color = onSurface),
                modifier = Modifier.padding(top = 10.dp, start = 10.dp, end = 10.dp, bottom = 5.dp)
            )
        }
    }

}