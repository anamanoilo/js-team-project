import api from './ApiService';
import notFoundImg from '../../images/not_found_ver.jpg';
import * as storage from './localStorage';

const refs = {
  list: document.querySelector('.movies'),
};

onLoading();

async function onLoading() {
  try {
    const movies = await api.fetchTrendingMovies();
    const moviesDatalist = prepareData(movies.results);
    storage.save('moviesData', moviesDatalist);
    makeMovieList(moviesDatalist);
  } catch (error) {
    handleError(error);
  }
}

function handleError(error) {
  resetView();
  console.log(error.message);
}

function resetView() {
  api.resetPage();
  refs.list.innerHTML = '';
}

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
      const rating = vote_average;
      return { id, filmTitle, poster, genres, year, rating };
    },
  );
}

function makeMovieList(array) {
  const markup = array
    .map(movieData => {
      return renderCard(movieData);
    })
    .join('');
  refs.list.insertAdjacentHTML('beforeend', markup);
}

function renderCard({ id, filmTitle, poster, genres, year, rating }) {
  return ` <li id='${id}' class="movies__item">
      <a href="">
        <img class="movies__img" src="https://image.tmdb.org/t/p/w500${poster}" alt="${filmTitle}" width="280" height="398">
        <div class="movies__wrapper">
          <h2 class="movies__name">${filmTitle}</h2>
          <div class="movies__wrapper--data">
            <span class="movies__genre">${genres}</span>
            <span class="movies__year">${year}</span>
            <span class="movies__rating">${rating}</span>
          </div>
        </div>
      </a>
    </li>
  `;
}

export { onLoading, makeMovieList, resetView };
