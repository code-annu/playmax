@file:OptIn(ExperimentalPermissionsApi::class)

package com.jetara.playmax.presentation.ui.home

import android.Manifest
import android.annotation.SuppressLint
import android.os.Build
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.navigation.NavController
import com.google.accompanist.permissions.ExperimentalPermissionsApi
import com.google.accompanist.permissions.PermissionStatus
import com.google.accompanist.permissions.rememberPermissionState
import com.jetara.playmax.presentation.ui.home.components.HomeScreenContent
import com.jetara.playmax.presentation.ui.home.components.VideoPermissionRequester
import com.jetara.playmax.presentation.viewmodel.MovieViewModel


@SuppressLint("InlinedApi")
@Composable
fun HomeScreen(
    modifier: Modifier = Modifier,
    navController: NavController,
    movieViewModel: MovieViewModel
) {
    val videoPermissionState = rememberPermissionState(
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) Manifest.permission.READ_MEDIA_VIDEO
        else Manifest.permission.READ_EXTERNAL_STORAGE
    )
    val scrollState = rememberScrollState()

    when (videoPermissionState.status) {
        PermissionStatus.Granted -> {
            HomeScreenContent(
                modifier = modifier.verticalScroll(scrollState),
                navController = navController,
                movieViewModel = movieViewModel
            )
        }

        is PermissionStatus.Denied -> {
            VideoPermissionRequester(modifier = modifier, onPermissionGranted = {})
        }
    }
}