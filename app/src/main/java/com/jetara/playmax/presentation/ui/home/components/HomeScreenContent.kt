package com.jetara.playmax.presentation.ui.home.components

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.jetara.playmax.app.navigation.AppRoute
import com.jetara.playmax.presentation.viewmodel.MovieViewModel

@Composable
fun HomeScreenContent(
    modifier: Modifier = Modifier,
    navController: NavController,
    movieViewModel: MovieViewModel
) {
    val moviesBuckets by movieViewModel.movieBuckets.collectAsState()

    LaunchedEffect(Unit) {
        movieViewModel.fetchMoviesBuckets(navController.context)
    }

    Column(modifier) {
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