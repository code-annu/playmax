package com.jetara.playmax.presentation.ui.home.components

import android.annotation.SuppressLint
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.unit.dp
import androidx.tv.material3.MaterialTheme
import androidx.tv.material3.Text
import com.jetara.playmax.app.theme.onSurface
import com.jetara.playmax.core.component.media.MovieItem
import com.jetara.playmax.domain.model.Movie
import com.jetara.playmax.domain.model.MovieBucket


@SuppressLint("ConfigurationScreenWidthHeight")
@Composable
fun BucketComponent(
    modifier: Modifier = Modifier,
    bucket: MovieBucket,
    onMovieFocus: ((Boolean, Movie) -> Unit)? = null,
    onMovieClick: (Movie) -> Unit
) {
    val configuration = LocalConfiguration.current
    val screenWidth = configuration.screenWidthDp.dp

    Column(modifier) {
        Text(
            text = bucket.name,
            color = onSurface,
            style = MaterialTheme.typography.titleLarge,
            modifier = Modifier.padding(horizontal = 12.dp),
        )
        Spacer(Modifier.height(32.dp))
        LazyRow(
            horizontalArrangement = Arrangement.spacedBy(48.dp),
            contentPadding = PaddingValues(horizontal = 36.dp)
        ) {
            items(bucket.movies) { movie ->
                MovieItem(
                    movie = movie,
                    onFocusChanged = onMovieFocus,
                    onClick = onMovieClick,
                    modifier = Modifier.width(screenWidth / 3)
                )
            }
        }
        Spacer(Modifier.height(14.dp))
    }
}