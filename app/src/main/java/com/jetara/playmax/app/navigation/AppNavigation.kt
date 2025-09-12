package com.jetara.playmax.app.navigation

import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.jetara.playmax.presentation.ui.home.HomeScreen
import com.jetara.playmax.presentation.viewmodel.MovieViewModel


@Composable
fun AppNavigation(modifier: Modifier = Modifier) {
    val navController = rememberNavController()
    val movieViewMode: MovieViewModel = viewModel()

    NavHost(navController = navController, startDestination = AppRoute.Home, modifier = modifier) {
        composable<AppRoute.Home> {
            HomeScreen(
                modifier = modifier,
                navController = navController,
                movieViewModel = movieViewMode
            )
        }

    }

}