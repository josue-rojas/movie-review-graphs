const MBDB_KEY = '6060e757b9b1e03c2b83ba42a4fa0c0d';

$('.input-wrapper  .search-input').keyup(function() {
  if (event.keyCode === 13) {
    searchClick();
  }
})

// onClick function for search button
// TODO handle pagination
function searchClick() {
  const SEARCH = $('.input-wrapper .search-input').val();
  const SEARCH_API_URL =  `https://api.themoviedb.org/3/search/movie?api_key=${MBDB_KEY}&query=${ encodeURIComponent(SEARCH)}`
  fetch(SEARCH_API_URL)
  .then(function(response){return response.json();})
  .then(function(data) {
    $movieResults = $('.movie-results');
    $movieResults.empty();
    // $('.movie-results').empty();
    for(let i = 0; i < data.results.length; i++){
      // TODO add alt for null
      // TODO add loader
      // TODO if total_results == 1then return that one
      // TODO if total_results == 0 then say so
      const IMG_SRC = `http://image.tmdb.org/t/p/w185/${data.results[i].poster_path}`;
      const TITLE = data.results[i].original_title;
      const ID = data.results[i].id;
      const SINGLE_MOVIE = makeMovieDiv(IMG_SRC, TITLE, ID);
      $movieResults.append(SINGLE_MOVIE)
    }
  });
  return
}

function makeMovieDiv(src, title, id){
  return $(
    `<div class="movie-wrapper" onClick="showWordGraph(${id})"> \
      <div class="image-wrapper"> \
        <img class="movie-poster" src="${src}"/> \
      </div> \
      <div class="title">${title}</div> \
    </div>`
  )
}

function showWordGraph(id) {
  // make sure everything is clear (cause working with one page)
  // TODO: might make this display none just to have a back button, maybe
  $('.movie-results').empty();
  const MOVIE_REVIEW_API_URL = `https://api.themoviedb.org/3/movie/${id}/reviews?api_key=${MBDB_KEY}`
  fetch(MOVIE_REVIEW_API_URL)
  .then(function(responce){return responce.json();})
  .then(function(data) {
    for(let i = 0; i < data.results.length; i++){
      console.log(`review ${i}`, data.results[i].content);
    }
  });
}
