package com.jetara.playmax.presentation.ui.home

import com.jetara.playmax.domain.model.MovieBucket

sealed class HomeUiState {
    object Loading : HomeUiState()
    data class Success(val movieBuckets: List<MovieBucket>) : HomeUiState()
    data class Error(val exception: Throwable) : HomeUiState()
}