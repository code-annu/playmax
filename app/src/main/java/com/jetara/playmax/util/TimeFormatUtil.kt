package com.jetara.playmax.util

import android.annotation.SuppressLint
import kotlin.time.Duration.Companion.milliseconds

object TimeFormatUtil {
    @SuppressLint("DefaultLocale")
    fun formatMillisecondsToHMS(milliseconds: Long): String {
        val duration = milliseconds.milliseconds

        val hours = duration.inWholeHours
        val minutes = duration.inWholeMinutes % 60 // Remaining minutes after extracting hours
        val seconds = duration.inWholeSeconds % 60 // Remaining seconds after extracting minutes

        return String.format("%02d:%02d:%02d", hours, minutes, seconds)
    }
}