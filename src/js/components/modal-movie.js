import api from '../services/ApiService';
import { addToWatched, addToQueue } from './cardTemplate';
import * as storage from '../services/localStorage';

const refs = {
  modal: document.querySelector('[data-modal]'),
  closeBtn: document.querySelector('[data-modal-close]'),
  innerModal: document.querySelector('.modal__card-movie'),
  spinner: document.querySelector('.spinner'),
};

function openModal(e) {
  e.preventDefault();
  if (e.target.tagName === 'UL') {
    return;
  }
  refs.spinner.classList.remove('visually-hidden');
  refs.modal.classList.add('is-open');
  api.movieId = Number(e.target.closest('li').id);
  refs.closeBtn.addEventListener('click', closeModal);
  const moviesData = storage.get('moviesData');
  const movie = moviesData.find(movie => movie.id === api.movieId);
  const {
    poster,
    filmTitle,
    rating,
    vote_count,
    popularity,
    original_title,
    genres,
    overview,
    id,
  } = movie;

  const markup = `
            <img src="${poster}" alt="${filmTitle}" class="modal__movie-img" />

            <div class="modal__wrapper-descriptor" >
              <h2 class="modal__movie-title">${filmTitle}</h2>
              <ul class="modal__list-movie-indicators">
                <li class="modal__list-vote">
                  <span class="modal__votes">Vote / Votes</span>
                  <span class="modal__span-rating-orange">${rating}</span>
                  <span class="modal__span-slesh">/</span>
                  <span class="modal__span-rating-gray">${vote_count}</span>
                </li>
                <li class="modal__list-popularity">
                  <span class="modal__votes">Popularity</span>${popularity}
                </li>
                <li class="modal__list-original-title">
                  <span class="modal__votes">Original Title</span>${original_title || 'Not found'}
                </li>
                <li class="modal__list-genre">
                  <span class="modal__votes">Genre</span>
                  <span class="modal__votes-data">${genres}</span>
                </li>
              </ul>
              <h3 class="modal__title-description">about</h3>
              <p class="modal__description">
                 ${overview}
              </p>
              <div class="modal__wrapper-btn" id="${id}" data-buttons>
                <button class="modal__btn current-btn" type="button" data-watched>
                  add to watched
                </button>
                <button class="modal__btn current-btn" type="button" data-queue>
                  add to queue
                </button>
              </div>
            
          
  `;
  refs.innerModal.insertAdjacentHTML('afterbegin', markup);

  const watchedRef = document.querySelector('[data-watched]');
  const queueRef = document.querySelector('[data-queue]');

  nameButton('watched', watchedRef, id);
  nameButton('queue', queueRef, id);

  watchedRef.addEventListener('click', addToWatched);
  queueRef.addEventListener('click', addToQueue);

  document.body.style.overflow = 'hidden';
  refs.spinner.classList.add('visually-hidden');
}

function closeModal(e) {
  // const watchedRef = document.querySelector('[data-watched]');
  // const queueRef = document.querySelector('[data-queue]');
  // watchedRef.removeEventListener('click', addToWatched);
  // queueRef.removeEventListener('click', addToQueue);
  document.body.style = '';
  refs.modal.classList.remove('is-open');
  refs.innerModal.innerHTML = '';
}

function nameButton(storageKey, btnRef, id) {
  const savedMovies = storage.get(storageKey) || [];

  for (const movie of savedMovies) {
    if (movie.id === id) {
      btnRef.textContent = `Remove from ${storageKey}`;
      btnRef.classList.remove('current-btn');
      return;
    }
    btnRef.textContent = `Add to ${storageKey}`;
    btnRef.classList.add('current-btn');
  }
}

export default openModal;
