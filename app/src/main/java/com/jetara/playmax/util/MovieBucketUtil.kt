package com.jetara.playmax.util

import androidx.compose.ui.util.fastForEachIndexed
import com.jetara.playmax.domain.model.Movie
import com.jetara.playmax.domain.model.MovieBucket

object MovieBucketUtil {
    private val BUCKET_NAMES = listOf("Picks for you", "Quick Pick", "Random Picks")
    fun mapToMoviesBucket(movies: List<Movie>, bucketMovieLimit: Int = 4): List<MovieBucket> {
        val movieBuckets = mutableListOf<MovieBucket>()

        BUCKET_NAMES.fastForEachIndexed { index, bucketName ->
            val randomMovies = movies.shuffled().take(bucketMovieLimit)
            val id = index + 1
            movieBuckets.add(
                MovieBucket(
                    id = id,
                    name = bucketName,
                    movies = randomMovies.map { movie -> movie.copy(bucketId = id) })
            )
        }
        return movieBuckets
    }
}