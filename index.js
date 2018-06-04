const MBDB_KEY = '6060e757b9b1e03c2b83ba42a4fa0c0d';

// "dynamic links" using url hash to have sort of direct links to reviews
if(window.location.hash !== "") showWordGraph(window.location.hash.substring(1));

$('.input-wrapper  .search-input').keyup(function() {
  if (event.keyCode === 13) {
    searchClick();
  }
})

// onClick function for search button
// TODO handle pagination
function searchClick() {
  window.location.hash = '';
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
      const IMG_SRC = `http://image.tmdb.org/t/p/w185/${data.results[i].backdrop_path}`;
      const TITLE = data.results[i].original_title;
      const ID = data.results[i].id;
      const DATE = data.results[i].release_date
      const SINGLE_MOVIE = makeMovieDiv(IMG_SRC, TITLE, DATE, ID);
      $movieResults.append(SINGLE_MOVIE)
    }
  });
  return
}

// function to make movie divs for results
function makeMovieDiv(src, title, date, id){
  return $(
    `<div class="movie-wrapper" onClick="showWordGraph(${id})"> \
      <div class="image-wrapper"> \
        <div class="movie-poster" style="background-image:url('${src}'"/> \
      </div> \
      <div class="info-wrapper"> \
        <div class="title">${title}</div> \
        <div class="date">${date}</div> \
      </div> \
    </div>`
  )
}

function showWordGraph(id) {
  // make sure everything is clear (cause working with one page)
  // TODO: might make this display none just to have a back button, maybe
  $('.movie-results').empty();
  window.location.hash = id;
  const MOVIE_REVIEW_API_URL = `https://api.themoviedb.org/3/movie/${id}/reviews?api_key=${MBDB_KEY}`
  fetch(MOVIE_REVIEW_API_URL)
  .then(function(responce){return responce.json();})
  .then(function(data) {
    const WORD_COUNT = {};
    let total_words = 0;
    for(let i = 0; i < data.results.length; i++){
      // TODO split to ignore special characters
      // TODO add words to ignore such as the or a
      const WORDS = data.results[i].content.split(' ');
      for(let j = 0; j < WORDS.length; j++){
        total_words++;
        const single_word = WORDS[j].toLowerCase();
        if(WORD_COUNT[single_word]){
          WORD_COUNT[single_word] += 1;
        }
        else{
          WORD_COUNT[single_word] = 1;
        }
      }
    }
    let words = Object.keys(WORD_COUNT)
    let word_holder = d3.select('.word-graph-wrapper');
    // console.log(word_holder)
    // return
    // let word_graph = word_holder.append('span');
    let word_graph = word_holder.selectAll('span')
    .data(words, function(d){return d})
    .enter().append('span')
    .text(function(d){return d})
    .style('font-size', function(d){console.log(WORD_COUNT[d]);return `${1+WORD_COUNT[d]*.4}rem`})
    .style('flex-grow', '1')
    .style('display', 'table')
    // TODO word graph should be made by a word having their rectangular box around be measure or just get the witdth and heigh and fit each word like a tetris game..........easy peasy
  });
}
