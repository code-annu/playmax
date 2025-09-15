package com.jetara.playmax.presentation.ui.search.components

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Image
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsFocusedAsState
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
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
import com.jetara.playmax.util.TimeFormatUtil

@Composable
fun MovieSearchResultItem(modifier: Modifier = Modifier, movie: Movie, onClick: (Movie) -> Unit) {
    val interactionSource = remember { MutableInteractionSource() }
    val isFocused by interactionSource.collectIsFocusedAsState()
    val borderColor = if (isFocused) onSurface else Color.Transparent
    val isPressed by interactionSource.collectIsPressedAsState()

    val targetScale = when {
        isPressed -> 0.95f
        isFocused -> 1.0f
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
        Row(modifier = Modifier.padding(8.dp)) {
            movie.thumbnail?.let { thumbnail ->
                Image(
                    bitmap = thumbnail.asImageBitmap(),
                    contentDescription = "${movie.title} thumbnail",
                    contentScale = ContentScale.Crop,
                    modifier = Modifier
                        .width(160.dp)
                        .aspectRatio(16f / 9f)
                        .clip(MaterialTheme.shapes.medium)
                )
            }
            Spacer(modifier = Modifier.width(12.dp))
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .align(Alignment.CenterVertically)
            ) {
                Text(
                    text = movie.title,
                    color = onSurface,
                    style = MaterialTheme.typography.titleMedium,
                    maxLines = 2
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = TimeFormatUtil.formatMillisecondsToHMS(movie.duration),
                    style = MaterialTheme.typography.bodySmall,
                    color = onSurface.copy(alpha = .8f)
                )
            }
        }
    }
}