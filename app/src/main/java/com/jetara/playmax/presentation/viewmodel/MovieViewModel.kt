package com.jetara.playmax.presentation.viewmodel

import android.content.Context
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.jetara.playmax.domain.model.Movie
import com.jetara.playmax.domain.model.MovieBucket
import com.jetara.playmax.util.MovieBucketUtil
import com.jetara.playmax.util.MovieUtil
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class MovieViewModel : ViewModel() {
    private val _movies = MutableStateFlow<List<Movie>>(emptyList())
    val movies = _movies.asStateFlow()

    private val _movieBuckets = MutableStateFlow<List<MovieBucket>>(emptyList())
    val movieBuckets = _movieBuckets.asStateFlow()

    fun fetchMoviesBuckets(context: Context) {
        viewModelScope.launch {
            _movies.value = MovieUtil.fetchMovies(context)
            _movieBuckets.value = MovieBucketUtil.mapToMoviesBucket(movies.value)
        }
    }

    fun getMovieFromBucket(bucketId: Int, movieId: Long): Movie? {
        return movieBuckets.value.find { it.id == bucketId }?.movies?.find { it.id == movieId }
    }

}