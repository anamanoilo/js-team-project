import api from '../services/ApiService';

import notFoundImg from '../img/not_found_ver.jpg';

const refs = {
  modal: document.querySelector('[data-modal]'),
  closeBtn: document.querySelector('[data-modal-close]'),
  innerModal: document.querySelector('.modal__card-movie'),
  spinner: document.querySelector('.spinner'),
};

async function openModal(e) {
  e.preventDefault();
  refs.spinner.classList.remove('visually-hidden');
  refs.modal.classList.add('is-open');
  api.movieId = Number(e.target.closest('li').id);
  refs.closeBtn.addEventListener('click', closeModal);
  try {
    api.movieId = Number(e.target.closest('li').id);
    const {
      id,
      original_title,
      genres,
      poster_path,
      overview,
      title,
      name,
      vote_average,
      popularity,
      vote_count,
    } = await api.fetchMovieDetails();
    const filmTitle = title || name;
    const movieGenres = genres.map(genre => genre.name).join(', ');
    const poster = poster_path ? `https://image.tmdb.org/t/p/w500${poster_path}` : notFoundImg;
    const rating = vote_average === 10 ? '10.0' : String(vote_average).padEnd(3, '.0');
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
                  <span class="modal__votes">Original Title</span>${original_title}
                </li>
                <li class="modal__list-genre">
                  <span class="modal__votes">Genre</span>
                  <span class="modal__votes-data">${movieGenres}</span>
                </li>
              </ul>
              <h3 class="modal__title-description">about</h3>
              <p class="modal__description">
                 ${overview}
              </p>
              <div class="modal__wrapper-btn" id="${id}">
                <button class="modal__btn current-btn" type="button">
                  add to watched
                </button>
                <button class="modal__btn" type="button">
                  add to queue
                </button>
              </div>
            
          
  `;
    refs.innerModal.insertAdjacentHTML('afterbegin', markup);
    document.body.style.overflow = 'hidden';
    refs.spinner.classList.add('visually-hidden');
  } catch (err) {
    refs.innerModal.innerHTML = 'Sorry, there is no additional info about this film';
    refs.spinner.classList.add('visually-hidden');
    console.error(err.message);
  }
}

function closeModal(e) {
  document.body.style = '';
  refs.modal.classList.remove('is-open');
  refs.innerModal.innerHTML = '';
}
export default openModal;
