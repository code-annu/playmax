package com.jetara.playmax.broadcast

import android.app.Service
import android.content.Intent
import android.os.IBinder
import com.jetara.playmax.MainActivity

class BootStartService : Service() {

    override fun onBind(intent: Intent?): IBinder? {
        return null
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        // Do not try to reassign "flags" or "startId"

        // Start the main activity
        val activityIntent = Intent(this, MainActivity::class.java).apply {
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP)
        }
        startActivity(activityIntent)

        // Once done, stop the service
        stopSelf()

        // Return appropriate flag
        // Use START_STICKY if you want the service to be restarted if killed
        // Or START_NOT_STICKY if you don't want it to restart automatically
        return START_NOT_STICKY
    }
}