// const Pagination = require('tui-pagination');
// import 'tui-pagination/dist/tui-pagination.css';
import api from '../services/ApiService';
import { onLoading } from '../services/movieList';
import { loadMoviesByKeyWord } from '../services/search';
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

function prevPageBtn() {
  api.page -= 1;
  isFirstPage();
  onLoading();

  const totalPages = storage.get('totalPages');
  const paginationLinks = document.querySelectorAll('.pagination__link');

  const lastCurrentLink = Number(paginationLinks[4].textContent);
  const firstCurrentLink = Number(paginationLinks[0].textContent);

  if (api.page >= firstCurrentLink) {
    let markup = '';
    for (let i = lastCurrentLink - 4; i < lastCurrentLink + 1; i += 1) {
      if (api.page === i) {
        markup += createFirstPage(i);
      } else {
        markup += createLinksMarkup(i);
      }
    }

    refs.listPagination.innerHTML = '';
    refs.listPagination.insertAdjacentHTML('beforeend', markup);
    return;
  }

  if (api.page < firstCurrentLink) {
    let markup = '';
    for (let i = firstCurrentLink - 5; i <= firstCurrentLink - 1; i += 1) {
      if (api.page === i) {
        markup += createFirstPage(i);
      } else {
        markup += createLinksMarkup(i);
      }
    }

    refs.listPagination.innerHTML = '';
    refs.listPagination.insertAdjacentHTML('beforeend', markup);
  }
}

function nextPageBtn() {
  api.page += 1;
  isFirstPage();

  onLoading();

  const totalPages = storage.get('totalPages');
  const paginationLinks = document.querySelectorAll('.pagination__link');
  const lastCurrentLink = Number(paginationLinks[4].textContent);
  const nextPagination = totalPages - lastCurrentLink;

  if (api.page <= lastCurrentLink) {
    let markup = '';
    for (let i = lastCurrentLink - 4; i < lastCurrentLink + 1; i += 1) {
      if (api.page === i) {
        markup += createFirstPage(i);
      } else {
        markup += createLinksMarkup(i);
      }
    }

    refs.listPagination.innerHTML = '';
    refs.listPagination.insertAdjacentHTML('beforeend', markup);
  }

  if (api.page > lastCurrentLink) {
    if (nextPagination <= 1) {
      refs.listPagination.innerHTML = '';
      return;
    }

    if (nextPagination <= 5) {
      let markup = '';
      for (let i = lastCurrentLink + 1; i <= nextPagination; i += 1) {
        if (api.page === i) {
          markup += createFirstPage(i);
        } else {
          markup += createLinksMarkup(i);
        }
      }

      refs.listPagination.innerHTML = '';
      refs.listPagination.insertAdjacentHTML('beforeend', markup);
    } else {
      let markup = '';
      for (let i = lastCurrentLink + 1; i <= lastCurrentLink + 5; i += 1) {
        if (api.page === i) {
          markup += createFirstPage(i);
        } else {
          markup += createLinksMarkup(i);
        }
      }

      refs.listPagination.innerHTML = '';
      refs.listPagination.insertAdjacentHTML('beforeend', markup);
    }
  }
}

async function onNumberClick(e) {
  e.preventDefault();
  if (e.target.tagName === 'A') {
    let pageNum = Number(e.target.textContent);
    api.page = pageNum;
    isFirstPage();
    await onLoading();
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
  if (api.page === totalPages) {
    refs.nextBtn.disabled = true;
  } else {
    refs.nextBtn.disabled = false;
  }
}

function createList(pages) {
  let markup = '';
  for (let i = 1; i <= pages; i += 1) {
    if (api.page === i) {
      markup += createFirstPage(i);
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

function createFirstPage(i) {
  return `<li class="pagination__item">
          <a class="pagination__link pagination__active" href="#">${i}</a>
        </li>`;
}

//Перевірка на кількість сторінок, залежно від кількості відобразиться 5 чи менше

function renderPagination() {
  const pages = storage.get('totalPages');

  if (pages <= 1) {
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
