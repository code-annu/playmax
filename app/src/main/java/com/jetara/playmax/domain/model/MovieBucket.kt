package com.jetara.playmax.domain.model

data class MovieBucket(
    val id: Int,
    val name: String,
    val movies: List<Movie>

)
