import api from './ApiService';
import notFoundImg from '../../images/not_found_ver.jpg';
import * as storage from './localStorage';

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
    console.log(error.message);
};



function resetView (){
  api.resetPage();
  refs.list.innerHTML = '';

<<<<<<< Updated upstream
=======
function prepareData(moviesList) {
  const allGenres = storage.get('genres');
  return moviesList.map(
    ({ id, title, poster_path, genre_ids, name, first_air_date, release_date, vote_average }) => {
      const genres = genre_ids
        .filter(id => allGenres[id])
        .map(id => allGenres[id])
        .join(', ');
      const filmTitle = title || name;
      const year = new Date(release_date || first_air_date).getFullYear();
      const poster = poster_path ? `https://image.tmdb.org/t/p/w500${poster_path}` : notFoundImg;
      const rating = String(vote_average).padEnd(3,".0");
      return { id, filmTitle, poster, genres, year, rating };
    },
  );
>>>>>>> Stashed changes
}

function makeMovieList(array) {
  const allGenres = storage.get('genres');
  const markup = array.map(({ id, title, poster_path, genre_ids, name, first_air_date, release_date, vote_average }) => {

    const genres = genre_ids.filter(id => allGenres[id])
      .map(id=>allGenres[id])
      .join(', ');


      const year = new Date(release_date).getFullYear();
      const year2 = new Date(first_air_date).getFullYear();
      const poster = poster_path ? `https://image.tmdb.org/t/p/w500${poster_path}` : notFoundImg;

            return ` <li id='${id}' class="movies__item">
      <a href="">
        <img class="movies__img" src="https://image.tmdb.org/t/p/w500${poster}" alt="${title || name}" width="280" height="398">
        <div class="movies__wrapper">
          <h2 class="movies__name">${title || name}</h2>
          <div class="movies__wrapper--data">
            <span class="movies__genre">${genres}</span>
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

export { onLoading, makeMovieList, resetView};