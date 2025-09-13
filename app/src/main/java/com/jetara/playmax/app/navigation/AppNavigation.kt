package com.jetara.playmax.app.navigation

import androidx.activity.compose.BackHandler
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.toRoute
import com.jetara.playmax.core.component.dialog.ExitConfirmationDialog
import com.jetara.playmax.presentation.ui.home.HomeScreen
import com.jetara.playmax.presentation.ui.media.MovieDetailScreen
import com.jetara.playmax.presentation.ui.player.PlayerScreen
import com.jetara.playmax.presentation.viewmodel.MovieViewModel


@Composable
fun AppNavigation(modifier: Modifier = Modifier) {
    val navController = rememberNavController()
    val movieViewMode: MovieViewModel = viewModel()
    var showExitDialog by remember { mutableStateOf(false) }
    val context = LocalContext.current

    BackHandler(enabled = true) {
        if (navController.currentBackStackEntry?.destination?.route != AppRoute.Home.toString()) {
            showExitDialog = true
        }
    }

    NavHost(navController = navController, startDestination = AppRoute.Home, modifier = modifier) {
        composable<AppRoute.Home> {
            HomeScreen(
                modifier = modifier,
                navController = navController,
                movieViewModel = movieViewMode
            )
        }
        composable <AppRoute.MovieDetail>{backStackEntry ->
            val args = backStackEntry.toRoute<AppRoute.MovieDetail>()
            MovieDetailScreen(
                modifier = modifier,
                bucketId = args.bucketId,
                videoId = args.movieId,
                videoViewModel = movieViewMode,
                navController = navController
            )
        }
        composable<AppRoute.MediaPlayer> { backStackEntry ->
            val args = backStackEntry.toRoute<AppRoute.MediaPlayer>()
            PlayerScreen(
                modifier = modifier,
                bucketId = args.bucketId,
                movieId = args.mediaId,
                movieViewModel = movieViewMode
            )
        }

    }

    if (showExitDialog) {
        ExitConfirmationDialog(
            onConfirmExit = {
                (context as? android.app.Activity)?.finish()
            },
            onDismiss = {
                // Dismiss the dialog and return to the app
                showExitDialog = false
            }
        )
    }

}

