// const Pagination = require('tui-pagination');
// import 'tui-pagination/dist/tui-pagination.css';
import api from '../services/ApiService';
import { onLoading } from '../services/movieList';
import { loadMoviesByKeyWord, inputValue } from '../services/search';
import * as storage from '../services/localStorage';

// const container = document.querySelector('#tui-pagination-container');

// let amountOfItems = 0;

// fetchPaginationData();

// async function fetchPaginationData() {
//   const response = await api.fetchTrendingMovies();
//   amountOfItems = response.total_results;

//   const options = {
//     // below default value of options
//     totalItems: amountOfItems,
//     itemsPerPage: 20,
//     visiblePages: 5,
//     centerAlign: false,
//   };

//   const pagination = new Pagination(container, options);
// }

/////////////////////////////////////////////////////////////////////

// async function fetchPaginationData() {
//   const response = await api.fetchTrendingMovies();
//   amountOfItems = response.total_results < 500 ? response.total_results : 500;

//   const options = {
//     // below default value of options
//     totalItems: amountOfItems,
//     itemsPerPage: 10,
//     visiblePages: 10,
//     page: 1,
//     centerAlign: false,
//     firstItemClassName: 'pagination__first-child',
//     lastItemClassName: 'pagination__last-child',

//     template: {
//       page: '<a href="#" class="pagination__page-btn">{{page}}</a>',
//       currentPage: '<strong class="pagination__page-btn pagination__is-selected">{{page}}</strong>',
//       moveButton:
//         '<a href="#" class="pagination__page-btn">' +
//         '<span class="tui-ico-{{type}}">{{type}}</span>' +
//         '</a>',
//       disabledMoveButton:
//         '<span class="pagination__page-btn tui-is-disabled">' +
//         '<span class="tui-ico-{{type}}">{{type}}</span>' +
//         '</span>',
//       moreButton:
//         '<a href="#" class="pagination__page-btn tui-{{type}}-is-ellip">' +
//         '<span class="tui-ico-ellip">...</span>' +
//         '</a>',
//     },
//   };

//   const pagination = new Pagination(container, options);
// }

/////////////////////////////////////////////////////////////

const refs = {
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

  const lastPage = listFirstPage + 4;

  const nextPagination = totalPages - lastPage;

  if (nextPagination < 5) {
    createList(listFirstPage, totalPages);
    return;
  }

  if (api.page > middlePage) {
    createList(api.page - 2, api.page + 2);
    listFirstPage += 1;
    return;
  }

  if (api.page <= middlePage) {
    createList(listFirstPage, listFirstPage + 4);
    listFirstPage += 1;
  }
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

  if (totalPages < 5) {
    createList(listFirstPage, totalPages);
    return;
  }

  if (api.page <= 3) {
    listFirstPage = 1;
    createList(listFirstPage, listFirstPage + 4);
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
    listFirstPage = api.page;
    const activeLink = document.querySelector('.pagination__active');
    activeLink.classList.remove('pagination__active');
    e.target.classList.add('pagination__active');
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
          <a class="pagination__link pagination__active" href="#">${i}</a>
        </li>`;
}

//Перевірка на кількість сторінок, залежно від кількості відобразиться 5 чи менше

function renderPagination() {
  isFirstPage();
  isLastPage();
  listFirstPage = 1;
  totalPages = storage.get('totalPages');

  if (totalPages <= 1) {
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
