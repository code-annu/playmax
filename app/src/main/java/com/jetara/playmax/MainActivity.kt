package com.jetara.playmax

import android.annotation.SuppressLint
import android.app.admin.DeviceAdminReceiver
import android.app.admin.DevicePolicyManager
import android.content.ComponentName
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.fillMaxSize
import androidx.tv.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.RectangleShape
import androidx.compose.ui.tooling.preview.Preview
import androidx.tv.material3.ExperimentalTvMaterial3Api
import androidx.tv.material3.Surface
import com.jetara.playmax.app.navigation.AppNavigation
import com.jetara.playmax.app.theme.PlayMaxTheme
import com.jetara.playmax.app.theme.primary
import com.jetara.playmax.app.theme.surface
import com.jetara.playmax.presentation.ui.home.HomeScreen

class MyDeviceAdminReceiver : DeviceAdminReceiver()
class MainActivity : ComponentActivity() {
    @SuppressLint("NewApi")
    @OptIn(ExperimentalTvMaterial3Api::class)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val dpm = getSystemService(DEVICE_POLICY_SERVICE) as DevicePolicyManager
        val adminComponent = ComponentName(this, MyDeviceAdminReceiver::class.java)
        if (dpm.isDeviceOwnerApp(packageName)) {
            dpm.setLockTaskPackages(adminComponent, arrayOf(packageName))
        }
        if (dpm.isLockTaskPermitted(packageName)) {
            startLockTask();
        }

        setContent {
            PlayMaxTheme {
                Surface(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(surface),
                    shape = RectangleShape
                ) {
                    AppNavigation(
                        modifier = Modifier
                            .fillMaxSize()
                            .background(surface)
                    )
                }
            }
        }
    }
}

