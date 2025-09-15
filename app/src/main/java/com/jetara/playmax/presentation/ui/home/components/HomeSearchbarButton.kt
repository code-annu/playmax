package com.jetara.playmax.presentation.ui.home.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.focusable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsFocusedAsState
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Search
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.tv.material3.Card
import androidx.tv.material3.CardDefaults
import androidx.tv.material3.Icon
import androidx.tv.material3.MaterialTheme
import androidx.tv.material3.Text
import com.jetara.playmax.app.theme.AppShapes
import com.jetara.playmax.app.theme.onSurface
import com.jetara.playmax.app.theme.surface

@Composable
fun HomeSearchbarButton(
    modifier: Modifier = Modifier, onClick: () -> Unit
) {
    val interactionSource = remember { MutableInteractionSource() }
    val isFocused by interactionSource.collectIsFocusedAsState()
    val borderColor = if (isFocused) onSurface else Color.Transparent

    Box(
        modifier = modifier
            .padding(vertical = 10.dp, horizontal = 48.dp)
            .background(
                color = Color.Transparent, shape = MaterialTheme.shapes.medium
            )
    ) {

        Card(
            onClick = onClick,
            modifier = Modifier.height(60.dp), shape = CardDefaults.shape(
                shape = AppShapes.small
            ), colors = CardDefaults.colors(
                containerColor = surface.copy(.5f),
                contentColor = onSurface,
            ), interactionSource = interactionSource
        ) {
            Row(
                Modifier
                    .fillMaxWidth()
                    .fillMaxHeight()
                    .padding(start = 10.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(imageVector = Icons.Default.Search, contentDescription = null)
                Spacer(Modifier.width(12.dp))
                Text(
                    text = "Search", style = MaterialTheme.typography.titleMedium
                )
            }
        }/*Button(
            onClick = onClick,
            modifier = Modifier
                .height(60.dp),
            shape = ButtonDefaults.shape(
                shape = AppShapes.small
            ),
            colors = ButtonDefaults.colors(
                containerColor = surface.copy(.5f),
                contentColor = onSurface
            ),
            interactionSource = interactionSource
        ) {
            Row(
                Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(imageVector = Icons.Default.Search, contentDescription = null)
                Spacer(Modifier.width(12.dp))
                Text(
                    text = "Search",
                    style = MaterialTheme.typography.titleMedium
                )
            }
        }*/
    }
}