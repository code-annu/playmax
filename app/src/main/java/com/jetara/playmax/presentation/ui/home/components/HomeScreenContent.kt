package com.jetara.playmax.presentation.ui.home.components

import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.navigation.NavController
import androidx.tv.material3.Text
import com.jetara.playmax.presentation.viewmodel.MovieViewModel

@Composable
fun HomeScreenContent(
    modifier: Modifier = Modifier,
    navController: NavController,
    movieViewModel: MovieViewModel
) {
    val moviesBuckets by movieViewModel.movieBuckets.collectAsState()

    Column(modifier) {
        moviesBuckets.map { movieBucket ->
            BucketComponent(
                bucket = movieBucket,
            ) { }
        }
    }
}