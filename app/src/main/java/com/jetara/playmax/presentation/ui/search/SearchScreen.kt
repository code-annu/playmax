package com.jetara.playmax.presentation.ui.search


import androidx.compose.foundation.border
import androidx.compose.foundation.focusable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsFocusedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.SearchBar
import androidx.compose.material3.SearchBarDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.TextFieldDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.focus.onFocusChanged
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalSoftwareKeyboardController
import androidx.compose.ui.unit.dp
import com.jetara.playmax.app.theme.onSurface
import com.jetara.playmax.app.theme.primary
import com.jetara.playmax.app.theme.surface
import com.jetara.playmax.domain.model.Movie
import com.jetara.playmax.presentation.ui.search.components.MovieSearchResultItem
import com.jetara.playmax.presentation.viewmodel.MovieViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SearchScreen(
    modifier: Modifier = Modifier,
    movieViewModel: MovieViewModel,
    onResultClick: (Movie) -> Unit,
) {
    var query by rememberSaveable { mutableStateOf("") }
    var expanded by rememberSaveable { mutableStateOf(true) }

    val interactionSource = remember { MutableInteractionSource() }
    val isFocused = interactionSource.collectIsFocusedAsState().value

    val focusRequester = remember { FocusRequester() }
    val keyboardController = LocalSoftwareKeyboardController.current

    val searchResults by movieViewModel.searchResults.collectAsState()

    val borderColor = if (isFocused && !expanded) primary else Color.Transparent

    Column(modifier.fillMaxSize()) {
        SearchBar(
            modifier = Modifier
                .fillMaxWidth()
                .border(width = 2.dp, color = borderColor, shape = MaterialTheme.shapes.medium)
                .focusable(interactionSource = interactionSource),
            shape = MaterialTheme.shapes.medium,
            inputField = {
                SearchBarDefaults.InputField(
                    colors = TextFieldDefaults.colors(
                        cursorColor = primary,
                        focusedLeadingIconColor = onSurface,
                        unfocusedLeadingIconColor = onSurface,
                        unfocusedTextColor = onSurface,
                        focusedTextColor = onSurface,

                    ),
                    query = query,
                    onQueryChange = {
                        query = it
                        movieViewModel.searchMovies(it)
                    },
                    onSearch = {
                        movieViewModel.searchMovies(query)
                        keyboardController?.hide()
                    },
                    expanded = expanded,
                    onExpandedChange = { expanded = it },
                    placeholder = { Text("Search", color = onSurface) },
                    leadingIcon = {
                        Icon(imageVector = Icons.Default.Search, contentDescription = "Search")
                    },
                    modifier = Modifier
                        .focusRequester(focusRequester)
                        .onFocusChanged {
                            if (it.isFocused) {
                                keyboardController?.show()
                            }
                        },
                    interactionSource = interactionSource,

                )
            },
            expanded = expanded,
            onExpandedChange = { expanded = it },
            colors = SearchBarDefaults.colors(
                containerColor = surface,
                dividerColor = onSurface,
            ),
            content = {
                SearchResultsComp(results = searchResults, onResultClick = onResultClick)
            }
        )
    }

    LaunchedEffect(Unit) {
        focusRequester.requestFocus()
        movieViewModel.clearSearchResults()
    }
}


@Composable
private fun SearchResultsComp(
    modifier: Modifier = Modifier,
    results: List<Movie>,
    onResultClick: (Movie) -> Unit
) {

    LazyColumn(
        modifier = modifier,
        verticalArrangement = Arrangement.spacedBy(36.dp),
        contentPadding = PaddingValues(
            vertical = 16.dp,
            horizontal = 48.dp
        )
    ) {
        items(results.size) { index ->
            MovieSearchResultItem(movie = results[index], onClick = onResultClick)
        }
    }
}