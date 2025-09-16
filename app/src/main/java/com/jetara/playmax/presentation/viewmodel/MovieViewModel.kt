package com.jetara.playmax.presentation.viewmodel

import android.content.Context
import android.util.Log
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.jetara.playmax.domain.model.Movie
import com.jetara.playmax.domain.model.MovieBucket
import com.jetara.playmax.presentation.ui.home.HomeUiState
import com.jetara.playmax.util.MovieBucketUtil
import com.jetara.playmax.util.MovieUtil
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class MovieViewModel : ViewModel() {
    private val _uiState = MutableStateFlow<HomeUiState>(HomeUiState.Loading)
    val uiState = _uiState.asStateFlow()

    private val _movies = MutableStateFlow<List<Movie>>(emptyList())
    val movies = _movies.asStateFlow()

    private val _movieBuckets = MutableStateFlow<List<MovieBucket>>(emptyList())
    val movieBuckets = _movieBuckets.asStateFlow()

    private val _featuredMovie = MutableStateFlow<Movie?>(null)
    val featuredMovie = _featuredMovie.asStateFlow()

    private val _searchResults = MutableStateFlow<List<Movie>>(emptyList())
    val searchResults = _searchResults.asStateFlow()

    fun getMovieBuckets(context: Context) {
        if (_movieBuckets.value.isNotEmpty()) {
            _uiState.value = HomeUiState.Success(_movieBuckets.value)
            return
        }
        viewModelScope.launch {
            try {
                _movies.value = MovieUtil.fetchMovies(context)
                _movieBuckets.value = MovieBucketUtil.mapToMoviesBucket(movies.value)
                _featuredMovie.value = _movieBuckets.value.random().movies.random()
                _uiState.value = HomeUiState.Success(_movieBuckets.value)
            } catch (e: Exception) {
                _uiState.value = HomeUiState.Error(e)
            }
        }
    }

    fun fetchMoviesBuckets(context: Context) {
        viewModelScope.launch {
            _movies.value = MovieUtil.fetchMovies(context)
            _movieBuckets.value = MovieBucketUtil.mapToMoviesBucket(movies.value)
            _featuredMovie.value = _movieBuckets.value.random().movies.random()
            Log.d("MovieViewModel", "Movies: ${movies.value}")
            Log.d("MovieViewModel", "Movies: ${movieBuckets.value}}")
        }
    }

    fun getMovieFromBucket(bucketId: Int, movieId: Long): Movie? {
        return movieBuckets.value.find { it.id == bucketId }?.movies?.find { it.id == movieId }
    }

    fun searchMovies(query: String) {
        viewModelScope.launch {
            if (query.isBlank()) {
                _searchResults.value = emptyList()
                return@launch
            }
            val movies = _movieBuckets.value.flatMap { it.movies }
            val results = movies.filter {
                it.title.contains(
                    query,
                    ignoreCase = true
                )
//                ) || it.description.contains(query, ignoreCase = true)
            }
            _searchResults.value = results
        }

    }

    fun clearSearchResults() {
        _searchResults.value = emptyList()
    }

}