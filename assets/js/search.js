function displayResults (results, store) {
  const searchResults = document.getElementById('results')
  if (results.length) {
    let resultList = ''
    // Iterate and build result list elements
    for (const n in results) {
      const item = store[results[n].ref]
      resultList += '<li><p><a href="' + item.url + '">' + item.title + '</a></p>'
      resultList += '<p>' + item.content.substring(0, 150) + '...</p></li>'
    }
    searchResults.innerHTML = resultList
  } else {
    searchResults.innerHTML = 'No results found.'
  }
}

// Get the query parameter(s)
const params = new URLSearchParams(window.location.search)
const query = params.get('q')
window.store = fetch("https://grumpy-learning.com/index.json");

// Perform a search if there is a query
if (query) {
  // Retain the search input in the form when displaying results
  document.getElementById('search-input').setAttribute('value', query)

  const idx = lunr(function () {
    this.ref('uri')
    this.field('title', {
      boost: 15
    })
    this.field('body', {
      boost: 10
    })

    for (const key in window.store) {
      this.add({
        id: key,
        title: window.store[key].title,
        content: window.store[key].content
      })
    }
  })

  // Perform the search
  const results = idx.search(query)
  // Update the list with results
  displayResults(results, window.store)
}
