package com.jetara.playmax.domain.model

import android.graphics.Bitmap
import android.net.Uri

data class Movie(
    val id: Long,
    val title: String,
    val uri: Uri,
    val duration: Long,
    val size: Long,
    val thumbnail: Bitmap?,
    val bucketId: Int,
    val bucketName: String,
    val description: String,
    val cast: List<String> = emptyList()
)