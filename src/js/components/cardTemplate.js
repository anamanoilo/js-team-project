import * as storage from '../services/localStorage';

const watchedRef = document.querySelector('.watched');
const queueRef = document.querySelector('.queue');

watchedRef.addEventListener('click', addToWatched);

function addToWatched(obj) {
  const savedMovies = storage.get('watched') || [];

  storage.save('watched', savedMovies.push(obj));
}
