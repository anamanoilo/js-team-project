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

  const middlePage = listFirstPage + 2;
  const nextPagination = totalPages - api.page;

  if (totalPages <= 5) {
    createList(1, totalPages);
    return;
  }

  if (nextPagination <= 2) {
    createList(totalPages - 4, totalPages);
    return;
  }

  if (api.page <= middlePage) {
    createList(listFirstPage, listFirstPage + 4);
    return;
  }

  createList(api.page - 2, api.page + 2);
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
  listFirstPage -= 1;
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
  }
}

function isFirstPage() {
  if (api.page === 1) {
    refs.prevBtn.disabled = true;
  } else {
    refs.prevBtn.disabled = false;
  }
}

function isLastPage() {
  if (api.page === totalPages) {
    refs.nextBtn.disabled = true;
  } else {
    refs.nextBtn.disabled = false;
  }
}

function createList(first, last) {
  markup = '';

  if (totalPages <= 10) {
    reconfigurePagination(first, last);
    refs.listPagination.innerHTML = '';
    refs.listPagination.insertAdjacentHTML('beforeend', markup);
    return;
  }

  if (api.page > 3) {
    markup += createLinksMarkup(1);
    markup += createPrevPagesBtn();
  }

  reconfigurePagination(first, last);

  if (totalPages - api.page > 2) {
    markup += createNextPagesBtn();
    markup += createLinksMarkup(totalPages);
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
}

function getNextPages() {
  const getPrevPagesRef = refs.listPagination.querySelector('[data-get="prev"]');
  const getNextPagesRef = refs.listPagination.querySelector('[data-get="next"]');
  const allPages = refs.listPagination.querySelectorAll('[data-pagination-link]');
  let secondElement = Number(allPages[1].textContent);
  let lastElement = Number(allPages[4].textContent);
  let nextRoll = totalPages - lastElement;

  if (nextRoll <= 6) {
    rollPages(totalPages - 5, totalPages - 1);
    getNextPagesRef.disabled = true;
    return;
  }

  if (!getPrevPagesRef) {
    rollPages(secondElement + 4, lastElement + 5);
  } else {
    rollPages(secondElement + 5, lastElement + 6);
  }
}

function getPrevPages() {
  const getPrevPagesRef = refs.listPagination.querySelector('[data-get="prev"]');
  const getNextPagesRef = refs.listPagination.querySelector('[data-get="next"]');
  const allPages = refs.listPagination.querySelectorAll('[data-pagination-link]');
  let secondElement = Number(allPages[1].textContent);
  let lastElement = Number(allPages[4].textContent);
  let nextRoll = lastElement - 5;

  if (nextRoll <= 5) {
    rollPages(listFirstPage + 1, listFirstPage + 5);
    getPrevPagesRef.disabled = true;
    return;
  }

  if (!getNextPagesRef) {
    rollPages(totalPages - 9, totalPages - 5);
  } else {
    rollPages(secondElement - 5, secondElement - 1);
  }
}

function rollPages(first, second) {
  markup = '';
  if (api.page === 1) {
    markup += createCurrentPage(api.page);
  } else {
    markup += createLinksMarkup(1);
  }

  markup += createPrevPagesBtn();
  reconfigurePagination(first, second);
  markup += createNextPagesBtn();

  if (api.page === totalPages) {
    markup += createCurrentPage(totalPages);
  } else {
    markup += createLinksMarkup(totalPages);
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
          <button class="pagination__link" type="button" data-get="next" disabled>...</button>
        </li>`;
}

function createPrevPagesBtn() {
  return `<li class="pagination__item">
          <button class="pagination__link" type="button" data-get="prev" disabled>...</button>
        </li>`;
}

function createLinksMarkup(i) {
  return `<li class="pagination__item">
          <a class="pagination__link" href="#" data-pagination-link>${i}</a>
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
