package com.jetara.playmax.presentation.ui.home.components

import android.annotation.SuppressLint
import android.util.Log
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ProgressIndicatorDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import androidx.tv.material3.Text
import com.jetara.playmax.app.navigation.AppRoute
import com.jetara.playmax.app.theme.onSurface
import com.jetara.playmax.app.theme.primary
import com.jetara.playmax.presentation.ui.home.HomeUiState
import com.jetara.playmax.presentation.viewmodel.MovieViewModel

@SuppressLint("ConfigurationScreenWidthHeight")
@Composable
fun HomeScreenContent(
    modifier: Modifier = Modifier, navController: NavController, movieViewModel: MovieViewModel
) {
    val context = LocalContext.current
    val uiState by movieViewModel.uiState.collectAsState()


    LaunchedEffect(Unit) {
//        movieViewModel.fetchMoviesBuckets(navController.context)
        movieViewModel.getMovieBuckets(context)
    }

    when (uiState) {
        HomeUiState.Loading -> {
            LoadingMoviesIndicator(modifier = modifier)
        }

        is HomeUiState.Success -> {
            MovieFetchSuccess(
                modifier = modifier, movieViewModel = movieViewModel, navController = navController
            )
        }

        is HomeUiState.Error -> {
            val error = (uiState as HomeUiState.Error).exception.message
            MovieFetchingError(modifier = modifier, message = error ?: "Something went wrong")
        }


    }


}


@Composable
private fun LoadingMoviesIndicator(modifier: Modifier = Modifier) {
    Box (
        modifier = modifier,
        contentAlignment = Alignment.Center
    ){
        CircularProgressIndicator(
             strokeWidth = 4.dp, color = onSurface
        )
    }
}

@Composable
private fun MovieFetchingError(modifier: Modifier = Modifier, message: String) {
    Text(
        modifier = modifier,
        text = message,
        style = MaterialTheme.typography.titleLarge.copy(color = primary)
    )
}

@SuppressLint("ConfigurationScreenWidthHeight")
@Composable
private fun MovieFetchSuccess(
    modifier: Modifier = Modifier, movieViewModel: MovieViewModel, navController: NavController
) {
    val moviesBuckets by movieViewModel.movieBuckets.collectAsState()
    val featuredMovie by movieViewModel.featuredMovie.collectAsState()
    val configuration = LocalConfiguration.current
    val screenHeight = configuration.screenHeightDp.dp

    Column(modifier) {
        Box {
            featuredMovie?.let {
                HomeFeatureSection(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(screenHeight / 1.3f),
                    movie = it,
                    onPlayNowClick = {
                        navController.navigate(AppRoute.MediaPlayer(it.bucketId, it.id))
                    },
                    onShowDetailsClick = {
                        navController.navigate(AppRoute.MovieDetail(it.bucketId, it.id))
                    })
            }
            HomeSearchbarButton(modifier = Modifier.fillMaxWidth(), onClick = {
                navController.navigate(AppRoute.Search)
            })
        }
        Spacer(Modifier.height(20.dp))
        moviesBuckets.map { movieBucket ->
            BucketComponent(
                bucket = movieBucket, onMovieClick = { movie ->
                    navController.navigate(AppRoute.MovieDetail(movieBucket.id, movie.id))
                })
        }
        Spacer(Modifier.height(20.dp))
    }

}