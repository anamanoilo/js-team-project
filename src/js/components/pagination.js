// const Pagination = require('tui-pagination');
// import 'tui-pagination/dist/tui-pagination.css';
import api from '../services/ApiService';
import { onLoading } from '../services/movieList';
import { loadMoviesByKeyWord } from '../services/search';

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
  links: document.querySelectorAll('.pagination__link'),
  list: document.querySelector('.movies'),
};

refs.listPagination.addEventListener('click', onNumberClick);
refs.prevBtn.addEventListener('click', prevPageBtn);
refs.nextBtn.addEventListener('click', nextPageBtn);

function prevPageBtn() {
  api.page -= 1;
  isFirstPage();
  refs.list.innerHTML = '';
  onLoading();
}

function nextPageBtn() {
  api.page += 1;
  isFirstPage();
  refs.list.innerHTML = '';
  onLoading();
}

function onNumberClick(e) {
  if (e.target.tagName === 'A') {
    let pageNum = Number(e.target.textContent);
    api.page = pageNum;
    isFirstPage();
    refs.list.innerHTML = '';
    onLoading();
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
  //доопрацювати
  if (api.page === 1) {
    refs.nextBtn.disabled = true;
  } else {
    refs.nextBtn.disabled = false;
  }
}

function createList(pages) {
  refs.listPagination.innerHTML = '';
  let markup = '';
  for (let i = 1; i <= pages; i += 1) {
    markup += createLinksMarkup(i);
  }
  refs.listPagination.insertAdjacentHTML('beforeend', markup);
}

function createLinksMarkup(i) {
  return `<li class="pagination__item">
          <a class="pagination__link" href="#">${i}</a>
        </li>`;
}

//Перевірка на кількість сторінок, залежно від кількості відобразиться 5 чи менше

function renderPagination(pages) {
  if (pages === 0) {
    refs.listPagination.innerHTML = '';
    return;
  }

  if (pages <= 5) {
    createList(pages);
  } else {
    createList(5);
  }
}

export { renderPagination };

/////////////////////////////////////////////////////////////////////////////

// class Pagination {
//   constructor(method) {
//     this.renderPagination();
//     clickCallback = method;
//   }

//   renderPagination() {
//     //render pagination
//   }
// }

// const trendingPagination = new Pagination(onLoading);
