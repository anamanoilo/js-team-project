import * as storage from '../services/localStorage';

const watchedRef = document.querySelector('.watched');
const queueRef = document.querySelector('.queue');

watchedRef.addEventListener('click', addToWatched);
queueRef.addEventListener('click', addToQueue);

function saveMovie(storageKey) {
  const arrayOfMovies = storage.get('moviesData');

  const object = arrayOfMovies.find(movie => movie.id === id);
  const savedMovies = storage.get(storageKey) || [];

  storage.save(storageKey, savedMovies.push(object));
}

function addToWatched() {
  saveMovie('watched');
}

function addToQueue() {
  saveMovie('queue');
}
