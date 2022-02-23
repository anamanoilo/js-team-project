const Pagination = require('tui-pagination');
import 'tui-pagination/dist/tui-pagination.css';
import api from '../services/ApiService';

const container = document.querySelector('#tui-pagination-container');

let amountOfItems = 0;

fetchPaginationData();

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

async function fetchPaginationData() {
  const response = await api.fetchTrendingMovies();
  amountOfItems = response.total_results;

  const options = {
    // below default value of options
    totalItems: amountOfItems,
    itemsPerPage: 10,
    visiblePages: 10,
    page: 1,
    centerAlign: false,
    firstItemClassName: 'pagination__first-child',
    lastItemClassName: 'pagination__last-child',

    template: {
      page: '<a href="#" class="pagination__page-btn">{{page}}</a>',
      currentPage: '<strong class="pagination__page-btn pagination__is-selected">{{page}}</strong>',
      moveButton:
        '<a href="#" class="pagination__page-btn tui-{{type}}">' +
        '<span class="tui-ico-{{type}}">{{type}}</span>' +
        '</a>',
      disabledMoveButton:
        '<span class="pagination__page-btn tui-is-disabled">' +
        '<span class="tui-ico-{{type}}">{{type}}</span>' +
        '</span>',
      moreButton:
        '<a href="#" class="pagination__page-btn tui-{{type}}-is-ellip">' +
        '<span class="tui-ico-ellip">...</span>' +
        '</a>',
    },
  };

  const pagination = new Pagination(container, options);
}
