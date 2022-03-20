import { onLoading, makeMovieList } from '../services/movieList';
import { renderPagination } from './pagination';
import api from '../services/ApiService';
import * as storage from '../services/localStorage';

const refs = {
  logo: document.querySelector('#logo'),
  header: document.querySelector('.header'),
  home: document.querySelector('#home'),
  library: document.querySelector('#library'),
  libraryBtn: document.querySelector('#libraryBtn'),
  search: document.querySelector('.search'),
  watchedBtn: document.querySelector('.watched__link'),
  queueBtn: document.querySelector('.queue__link'),
  list: document.querySelector('.movies'),
  input: document.querySelector('.search__input'),
  spinner: document.querySelector('.spinner'),
};
async function onHome() {
  refs.header.classList.remove('library');
  refs.search.classList.remove('visually-hidden');
  refs.libraryBtn.classList.add('visually-hidden');
  refs.home.classList.add('current');
  refs.library.classList.remove('current');
  refs.input.value = '';
  api.resetPage();
  await onLoading();
  renderPagination();
  refs.queueBtn.classList.remove('is-active');
  refs.watchedBtn.classList.add('is-active');
}
async function onLibrary() {
  refs.header.classList.add('library');
  refs.search.classList.add('visually-hidden');
  refs.libraryBtn.classList.remove('visually-hidden');
  refs.home.classList.remove('current');
  refs.library.classList.add('current');
  api.resetPage();
  await onLoading();
  renderPagination();
  onWatchedBtn();
}
async function onWatchedBtn() {
  refs.spinner.classList.remove('visually-hidden');
  refs.watchedBtn.classList.add('is-active');
  refs.queueBtn.classList.remove('is-active');
  const watchedMovies = storage.get('watched');
  const totalPages = Math.ceil(watchedMovies.length / 20);
  storage.save('totalPages', totalPages);
  await makeMovieList(watchedMovies);
  renderPagination();
  refs.spinner.classList.add('visually-hidden');
}
async function onQueueBtn() {
  refs.spinner.classList.remove('visually-hidden');
  refs.watchedBtn.classList.remove('is-active');
  refs.queueBtn.classList.add('is-active');
  const queueMovies = storage.get('queue');
  const totalPages = Math.ceil(queueMovies.length / 20);
  storage.save('totalPages', totalPages);
  await makeMovieList(queueMovies);
  renderPagination();
  refs.spinner.classList.add('visually-hidden');
}

refs.watchedBtn.addEventListener('click', onWatchedBtn);
refs.queueBtn.addEventListener('click', onQueueBtn);
refs.logo.addEventListener('click', onHome);
refs.home.addEventListener('click', onHome);
refs.library.addEventListener('click', onLibrary);
