package com.jetara.playmax.util

import android.content.ContentUris
import android.content.Context
import android.graphics.Bitmap
import android.media.MediaMetadataRetriever
import android.media.MediaScannerConnection
import android.os.Build
import android.os.Environment
import android.provider.MediaStore
import android.util.Log
import android.util.Size
import com.jetara.playmax.domain.model.Movie
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

object MovieUtil {

    suspend fun fetchMovies(context: Context) = withContext(Dispatchers.IO) {
        val dir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS)
        MediaScannerConnection.scanFile(
            context,
            arrayOf(dir.absolutePath),
            null
        ) { path, uri ->
            Log.d("fetchVideos", "Scanned $path, new URI: $uri")
        }
        val movies = mutableListOf<Movie>()
        val collection = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            MediaStore.Video.Media.getContentUri(MediaStore.VOLUME_EXTERNAL)
        } else {
            MediaStore.Video.Media.EXTERNAL_CONTENT_URI
        }
        val projection = arrayOf(
            MediaStore.Video.Media._ID,
            MediaStore.Video.Media.DISPLAY_NAME,
            MediaStore.Video.Media.DURATION,
            MediaStore.Video.Media.SIZE,
            MediaStore.Video.Media.DATA,
            MediaStore.Video.Media.BUCKET_DISPLAY_NAME,
            MediaStore.Video.Media.BUCKET_ID,
            MediaStore.Video.Media.DATE_ADDED
        )
        val cursor = context.contentResolver.query(collection, projection, null, null, null)
        cursor?.use { c ->
            val idCol = c.getColumnIndexOrThrow(MediaStore.Video.Media._ID)
            val nameCol = c.getColumnIndexOrThrow(MediaStore.Video.Media.DISPLAY_NAME)
            val durCol = c.getColumnIndexOrThrow(MediaStore.Video.Media.DURATION)
            val sizeCol = c.getColumnIndexOrThrow(MediaStore.Video.Media.SIZE)
            val dataCol = c.getColumnIndexOrThrow(MediaStore.Video.Media.DATA)
            val bucketCol = c.getColumnIndexOrThrow(MediaStore.Video.Media.BUCKET_DISPLAY_NAME)
            val bucketIdCol = c.getColumnIndexOrThrow(MediaStore.Video.Media.BUCKET_ID)
            val dateAddedCol = c.getColumnIndexOrThrow(MediaStore.Video.Media.DATE_ADDED)
            Log.i("fetchVideos", "${cursor.count}")

            while (c.moveToNext()) {
                val id = c.getLong(idCol)
                val name = c.getString(nameCol)
                val duration = c.getLong(durCol)
                val size = c.getLong(sizeCol)
                val data = c.getString(dataCol)
                val bucketName = c.getString(bucketCol)
                val bucketId = c.getString(bucketIdCol)
                val dateAdded = c.getLong(dateAddedCol)

                // Build content URI for this video:
                val contentUri = ContentUris.withAppendedId(
                    MediaStore.Video.Media.EXTERNAL_CONTENT_URI, id
                )

                Log.i(
                    "fetchVideos",
                    "contentUri: $contentUri name: $name bucketId: $bucketId bucket: $bucketName data: $data duration: $duration size: $size"
                )

                var thumbnail: Bitmap?
                try {
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                        thumbnail = context.contentResolver.loadThumbnail(
                            contentUri,
                            Size(2880, 2160),
                            null
                        )
                    } else {
                        val retriever = MediaMetadataRetriever().apply {
                            setDataSource(context, contentUri)
                        }
                        thumbnail = retriever.frameAtTime
                        retriever.release()
                    }
                } catch (_: Exception) {
                    val retriever = MediaMetadataRetriever().apply {
                        setDataSource(context, contentUri)
                    }
                    thumbnail = retriever.frameAtTime
                    retriever.release()
                }


                movies.add(
                    Movie(
                        id = id,
                        title = name,
                        uri = contentUri,
                        duration = duration,
                        size = size,
                        thumbnail = thumbnail,
                        bucketId = -1,
                        bucketName = bucketName,
                        description = "Nine noble families wage war against each other in order to gain control over the mythical land of Westeros. Meanwhile, a force is rising after millenniums and threatens the existence of living men.",
                        cast = listOf(
                            "Jon Snow",
                            "Kit Harington",
                            "Emilia Clarke",
                            "Maisie Williams",
                            "Nikolaj Coster-Waldau",
                            "Isaac Hempstead Wright"
                        )
                    )
                )
            }
        }

        Log.i("fetchVideos", "videos: $movies")
        return@withContext movies
    }

}
