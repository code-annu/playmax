package com.jetara.playmax.app.navigation

import kotlinx.serialization.Serializable

sealed class AppRoute {
    @Serializable
    object Home : AppRoute()

    @Serializable
    data class VideoPlayer(val bucketId: String, val videoId: Long) : AppRoute()

    @Serializable
    object Search : AppRoute()

    @Serializable
    data class MovieDetail(val bucketId: String, val videoId: Long) : AppRoute()


}