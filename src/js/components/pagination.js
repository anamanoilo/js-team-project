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
  const totalPages = storage.get('totalPages');
  if (api.page === totalPages) {
    refs.nextBtn.disabled = true;
  } else {
    refs.nextBtn.disabled = false;
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
  }

  if (getPrevPagesRef) {
    getPrevPagesRef.addEventListener('click', getPrevPages);
  }
}

function getNextPages() {
  const elements = refs.listPagination.querySelectorAll('.pagination__link');
  const firstElement = Number(elements[0].textContent);
  const lastElement = Number(elements[4].textContent);
  createList(firstElement + 5, lastElement + 5);
}

function getPrevPages() {
  console.log('click');
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
          <button class="pagination__link" type="button" data-get="next">...</button>
        </li>`;
}

function createPrevPagesBtn() {
  return `<li class="pagination__item">
          <button class="pagination__link" type="button" data-get="prev">...</button>
        </li>`;
}

function createLinksMarkup(i) {
  return `<li class="pagination__item">
          <a class="pagination__link" href="#">${i}</a>
        </li>`;
}

function createCurrentPage(i) {
  return `<li class="pagination__item">
          <span class="pagination__link pagination__active" href="#">${i}</span>
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

  // if (totalPages > 500) {
  //   totalPages = 500;
  // }

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
