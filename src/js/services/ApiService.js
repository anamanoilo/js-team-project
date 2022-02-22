import axios from 'axios';

axios.defaults.baseURL = 'https://api.themoviedb.org/3';

class ApiService {
  #API_KEY = '53d591c4c7c46fce2d77997efee7f254';
  #page = 1;

  //вызывайте этот метод по нажатию на логотип/кнопку "Home" (Андрей)
  // вызывайте этот метод, чтобы реализовать подгрузку популярных фильмов на главную  страницу (Вадим)
  async fetchTrendingMovies() {
    const response = await axios.get(
      `/trending/movies/day?api_key=${this.#API_KEY}&page=${this.#page}`,
    );
    return response.data;
  }

  //вызывайте этот метод, чтобы получить информацию про фильм по айдишке для модалки (Виктор)
  async fetchMovieDetails(id) {
    const response = await axios.get(`/movie/${id}?api_key=${this.#API_KEY}&language=en-US`);
    return response.data;
  }
  //вызывайте этот метод, чтобы реализовать поиск фильмов по ключевому слову (Валентин)
  async fetchMovieByKeyword(word) {
    const response = await axios.get(
      `/search/movie/?api_key=${this.#API_KEY}&query=${word}&language=en-US&include_adult=false`,
    );
    return response.data;
  }

  get page() {
    return this.#page;
  }

  incrementPage() {
    this.#page += 1;
  }

  resetPage() {
    this.#page = 1;
  }
}
const api = new ApiService();

export default api;

//примеры вызова  методов

// api.fetchTrendingMovies();
// api.fetchMovieDetails(646385);
// api.fetchMovieByKeyword('rooms');

//не забудьте у себя обработать ошибки через try... catch и выполнить команду npm ci для того чтобы подтянуть axios
