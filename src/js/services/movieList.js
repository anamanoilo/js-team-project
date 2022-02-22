import api from './ApiService';

const refs = {
    list: document.querySelector(".movies")
};

onLoading();

async function onLoading() {
   try {
       const movies = await api.fetchTrendingMovies();
       const moviesList = movies.results;
       makeMovieList(moviesList);
    } catch (error) {
        handleError(error);
    }
};

function handleError (error) {
    resetView();
    console.log(error.status_message);
};



function resetView (){
  api.resetPage();
  refs.list.innerHTML = '';

}

function makeMovieList(array) {

    const markup = array.map(({ id, title, poster_path, name, first_air_date, release_date, vote_average}) => {
        const year = new Date(release_date).getFullYear();
        const year2 = new Date(first_air_date).getFullYear();
            return ` <li id='${id}' class="movies__item">
      <a href="">
        <img class="movies__img" src="https://image.tmdb.org/t/p/w500${poster_path}" alt="${title || name}" width="280" height="398">
        <div class="movies__wrapper">
          <h2 class="movies__name">${title || name}</h2>
          <div class="movies__wrapper--data">
            <span class="movies__genre">genre</span>
            <span class="movies__year">${year || year2}</span>
            <span class="movies__rating">${vote_average}</span>
          </div>
        </div>
      </a>
    </li>
  `;
    }).join("");
    refs.list.insertAdjacentHTML('beforeend', markup);
}
