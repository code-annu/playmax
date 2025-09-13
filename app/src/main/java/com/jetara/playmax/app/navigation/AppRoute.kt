package com.jetara.playmax.app.navigation

import kotlinx.serialization.Serializable

sealed class AppRoute {
    @Serializable
    object Home : AppRoute()

    @Serializable
    data class MediaPlayer(val bucketId: Int, val mediaId: Long) : AppRoute()

    @Serializable
    object Search : AppRoute()

    @Serializable
    data class MovieDetail(val bucketId: Int, val movieId: Long) : AppRoute()
}