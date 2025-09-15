package com.jetara.playmax.presentation.ui.home.components

import android.annotation.SuppressLint
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.jetara.playmax.app.navigation.AppRoute
import com.jetara.playmax.presentation.viewmodel.MovieViewModel

@SuppressLint("ConfigurationScreenWidthHeight")
@Composable
fun HomeScreenContent(
    modifier: Modifier = Modifier,
    navController: NavController,
    movieViewModel: MovieViewModel
) {
    val moviesBuckets by movieViewModel.movieBuckets.collectAsState()
    val featuredMovie by movieViewModel.featuredMovie.collectAsState()
    val configuration = LocalConfiguration.current
    val screenHeight = configuration.screenHeightDp.dp


    LaunchedEffect(Unit) {
        movieViewModel.fetchMoviesBuckets(navController.context)
    }

    Column(modifier) {
        Box {
            featuredMovie?.let {
                HomeFeatureSection(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(screenHeight / 1.3f),
                    movie = it,
                    onPlayNowClick = { movie ->
                        navController.navigate(AppRoute.MediaPlayer(movie.bucketId, movie.id))
                    },
                    onShowDetailsClick = { movie ->
                        navController.navigate(AppRoute.MovieDetail(movie.bucketId, it.id))
                    }
                )
            }
            HomeSearchbarButton(modifier = Modifier.fillMaxWidth(), onClick = {
                navController.navigate(AppRoute.Search)
            })
        }
        Spacer(Modifier.height(20.dp))
        moviesBuckets.map { movieBucket ->
            BucketComponent(
                bucket = movieBucket,
                onMovieClick = { movie ->
                    navController.navigate(AppRoute.MovieDetail(movieBucket.id, movie.id))
                }
            )
        }
        Spacer(Modifier.height(20.dp))

    }
}