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

async function nextPageBtn() {
  api.page += 1;
  isLastPage();
  isFirstPage();

  if (inputValue) {
    await loadMoviesByKeyWord();
  } else {
    await onLoading();
  }

  totalPages = storage.get('totalPages');
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

  totalPages = storage.get('totalPages');
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

    totalPages = storage.get('totalPages');
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
  let markup = '';
  for (let i = first; i <= last; i += 1) {
    if (api.page === i) {
      markup += createCurrentPage(i);
    } else {
      markup += createLinksMarkup(i);
    }
  }
  refs.listPagination.innerHTML = '';
  refs.listPagination.insertAdjacentHTML('beforeend', markup);
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
