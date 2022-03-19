import api from '../services/ApiService';
import { onLoading } from '../services/movieList';
import { loadMoviesByKeyWord, inputValue } from '../services/search';
import * as storage from '../services/localStorage';

const refs = {
  pagination: document.querySelector('[data-pagination]'),
  prevBtn: document.querySelector('[data-btn="prev"]'),
  nextBtn: document.querySelector('[data-btn="next"]'),
  listPagination: document.querySelector('#pagination__list'),
  list: document.querySelector('.movies'),
};

refs.listPagination.addEventListener('click', onNumberClick);
refs.prevBtn.addEventListener('click', prevPageBtn);
refs.nextBtn.addEventListener('click', nextPageBtn);

let listFirstPage = 1;
let totalPages = storage.get('totalPages');
let markup = '';

async function nextPageBtn() {
  api.page += 1;
  isLastPage();
  isFirstPage();

  if (inputValue) {
    await loadMoviesByKeyWord();
  } else {
    await onLoading();
  }

  if (totalPages <= 7) {
    disableNextRoll();
    disablePrevRoll();
  }

  const nextPagination = totalPages - api.page;

  if (totalPages <= 5) {
    createList(1, totalPages);
    return;
  }

  if (nextPagination <= 2) {
    createList(totalPages - 4, totalPages);
    return;
  }

  if (api.page <= 3) {
    createList(listFirstPage, listFirstPage + 4);
    return;
  }

  createList(api.page - 2, api.page + 2);
  checkPagination();
}

async function prevPageBtn() {
  api.page -= 1;
  isFirstPage();
  isLastPage();

  if (inputValue) {
    await loadMoviesByKeyWord();
  } else {
    await onLoading();
  }

  if (totalPages <= 7) {
    disableNextRoll();
    disablePrevRoll();
  }

  const nextPagination = totalPages - api.page;

  if (totalPages <= 5) {
    createList(1, totalPages);
    return;
  }

  if (api.page <= 3) {
    createList(listFirstPage, listFirstPage + 4);
    return;
  }

  if (nextPagination <= 2) {
    createList(totalPages - 4, totalPages);
    return;
  }

  createList(api.page - 2, api.page + 2);
  checkPagination();
}

async function onNumberClick(e) {
  e.preventDefault();
  if (e.target.tagName === 'A') {
    let pageNum = Number(e.target.textContent);
    api.page = pageNum;
    isFirstPage();
    isLastPage();

    if (inputValue) {
      await loadMoviesByKeyWord();
    } else {
      await onLoading();
    }

    if (totalPages <= 7) {
      disableNextRoll();
      disablePrevRoll();
    }

    const nextPagination = totalPages - api.page;

    if (totalPages <= 5) {
      createList(1, totalPages);
      return;
    }

    if (api.page <= 3) {
      listFirstPage = 1;
      createList(listFirstPage, listFirstPage + 4);
      return;
    }

    if (nextPagination <= 2) {
      createList(totalPages - 4, totalPages);
      return;
    }

    createList(api.page - 2, api.page + 2);
    checkPagination();
  }
}

function checkPagination() {
  const allPages = refs.listPagination.querySelectorAll('[data-pagination-link]');
  let lastElement = Number(allPages[4].textContent);
  let nextRoll = totalPages - lastElement;

  if (nextRoll <= 1) {
    disableNextRoll();
  } else if (api.page <= 4) {
    disablePrevRoll();
  } else {
    enableNextRoll();
    enablePrevRoll();
  }
}

function isFirstPage() {
  if (api.page === 1) {
    refs.prevBtn.disabled = true;
    refs.prevBtn.classList.add('pagination__disabled');
  } else {
    refs.prevBtn.disabled = false;
    refs.prevBtn.classList.remove('pagination__disabled');
  }
}

function isLastPage() {
  if (api.page === totalPages) {
    refs.nextBtn.disabled = true;
    refs.nextBtn.classList.add('pagination__disabled');
  } else {
    refs.nextBtn.disabled = false;
    refs.nextBtn.classList.remove('pagination__disabled');
  }
}

function createList(first, last) {
  markup = '';

  if (totalPages <= 5) {
    reconfigurePagination(first, last);
    refs.listPagination.innerHTML = '';
    refs.listPagination.insertAdjacentHTML('beforeend', markup);
    return;
  }

  if (api.page > 3) {
    markup += createAdditionalPage(1);
    markup += createPrevPagesBtn();
  }

  reconfigurePagination(first, last);

  if (totalPages - api.page > 2) {
    markup += createNextPagesBtn();
    markup += createAdditionalPage(totalPages);
  }

  refs.listPagination.innerHTML = '';
  refs.listPagination.insertAdjacentHTML('beforeend', markup);

  const getNextPagesRef = refs.listPagination.querySelector('[data-get="next"]');
  const getPrevPagesRef = refs.listPagination.querySelector('[data-get="prev"]');

  if (getNextPagesRef) {
    getNextPagesRef.addEventListener('click', getNextPages);
    getNextPagesRef.disabled = false;
  }

  if (getPrevPagesRef) {
    getPrevPagesRef.addEventListener('click', getPrevPages);
    getPrevPagesRef.disabled = false;
  }

  if (totalPages <= 7) {
    disableNextRoll();
    disablePrevRoll();
  }
}

function getNextPages() {
  const allPages = refs.listPagination.querySelectorAll('[data-pagination-link]');
  let firstElement = Number(allPages[0].textContent);
  let lastElement = Number(allPages[4].textContent);
  let nextRoll = totalPages - lastElement;

  if (nextRoll <= 5) {
    rollPages(totalPages - 5, totalPages - 1);
    disableNextRoll();
    return;
  }

  rollPages(firstElement + 5, lastElement + 5);
}

function getPrevPages() {
  const allPages = refs.listPagination.querySelectorAll('[data-pagination-link]');
  let firstElement = Number(allPages[0].textContent);
  let lastElement = Number(allPages[4].textContent);
  let prevRoll = lastElement - 5;

  if (prevRoll <= 5) {
    rollPages(listFirstPage + 1, listFirstPage + 5);
    disablePrevRoll();
    return;
  }

  rollPages(firstElement - 5, firstElement - 1);
}

function disableNextRoll() {
  const getNextPagesRef = refs.listPagination.querySelector('[data-get="next"]');
  if (getNextPagesRef) {
    getNextPagesRef.disabled = true;
    getNextPagesRef.classList.add('pagination__disabled');
  }
}

function enableNextRoll() {
  const getNextPagesRef = refs.listPagination.querySelector('[data-get="next"]');
  if (getNextPagesRef) {
    getNextPagesRef.disabled = false;
    getNextPagesRef.classList.remove('pagination__disabled');
  }
}

function disablePrevRoll() {
  const getPrevPagesRef = refs.listPagination.querySelector('[data-get="prev"]');
  if (getPrevPagesRef) {
    getPrevPagesRef.disabled = true;
    getPrevPagesRef.classList.add('pagination__disabled');
  }
}

function enablePrevRoll() {
  const getPrevPagesRef = refs.listPagination.querySelector('[data-get="prev"]');
  if (getPrevPagesRef) {
    getPrevPagesRef.disabled = false;
    getPrevPagesRef.classList.remove('pagination__disabled');
  }
}

function rollPages(first, second) {
  markup = '';

  if (api.page === 1) {
    markup += createAdditionalActive(api.page);
  } else {
    markup += createAdditionalPage(1);
  }

  markup += createPrevPagesBtn();
  reconfigurePagination(first, second);
  markup += createNextPagesBtn();

  if (api.page === totalPages) {
    markup += createAdditionalActive(totalPages);
  } else {
    markup += createAdditionalPage(totalPages);
  }

  refs.listPagination.innerHTML = '';
  refs.listPagination.insertAdjacentHTML('beforeend', markup);

  const getNextPagesRef = refs.listPagination.querySelector('[data-get="next"]');
  const getPrevPagesRef = refs.listPagination.querySelector('[data-get="prev"]');

  if (getNextPagesRef) {
    getNextPagesRef.addEventListener('click', getNextPages);
    getPrevPagesRef.disabled = false;
  }

  if (getPrevPagesRef) {
    getPrevPagesRef.addEventListener('click', getPrevPages);
    getNextPagesRef.disabled = false;
  }

  if (totalPages <= 7) {
    disableNextRoll();
    disablePrevRoll();
  }
}

function reconfigurePagination(first, last) {
  for (let i = first; i <= last; i += 1) {
    if (api.page === i) {
      markup += createCurrentPage(i);
    } else {
      markup += createLinksMarkup(i);
    }
  }
}

function createNextPagesBtn() {
  return `<li class="pagination__item">
          <button class="pagination__roll" type="button" data-get="next" disabled>...</button>
        </li>`;
}

function createPrevPagesBtn() {
  return `<li class="pagination__item">
          <button class="pagination__roll" type="button" data-get="prev" disabled>...</button>
        </li>`;
}

function createLinksMarkup(i) {
  return `<li class="pagination__item">
          <a class="pagination__link" href="#" data-pagination-link>${i}</a>
        </li>`;
}

function createAdditionalPage(i) {
  return `<li class="pagination__item">
          <a class="pagination__page" href="#">${i}</a>
        </li>`;
}

function createAdditionalActive(i) {
  return `<li class="pagination__item">
          <span class="pagination__page pagination__active" href="#">${i}</span>
        </li>`;
}

function createCurrentPage(i) {
  return `<li class="pagination__item">
          <span class="pagination__link pagination__active" href="#" data-pagination-link>${i}</span>
        </li>`;
}

function showButtons() {
  refs.pagination.classList.remove('is-hidden');
}

function hideButtons() {
  refs.pagination.classList.add('is-hidden');
}

//Перевірка на кількість сторінок, залежно від кількості відобразиться 5 чи менше
function renderPagination() {
  showButtons();
  isFirstPage();
  isLastPage();
  listFirstPage = 1;
  totalPages = storage.get('totalPages');

  if (totalPages > 500) {
    totalPages = 500;
  }

  if (totalPages <= 1) {
    hideButtons();
    refs.listPagination.innerHTML = '';
    return;
  }

  if (totalPages <= 5) {
    createList(listFirstPage, totalPages);
  } else {
    createList(listFirstPage, 5);
  }
}

export { renderPagination };
