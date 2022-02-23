import api from './ApiService';


const refs ={
    searchForm: document.querySelector(".form"),
    searchBtn: document.querySelector('.btn-sub'),
    input: document.querySelector('input[name="searchQuery"]')
}

let inputValue = '';

refs.searchForm.addEventListener('submit', searchFilms);


async function searchFilms(e) {
    e.preventDefault();
  
    inputValue = refs.input.value.trim();
  
    if (!inputValue) {
      console.log('net');
      return;
    }

    try {
      const res = await fetchMovieByKeyword();
      console.log('da')
      console.log(res)

    } catch (error) {
        console.log('net')
    }
  }