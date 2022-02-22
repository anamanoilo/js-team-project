import axios from 'axios';

axios.defaults.baseURL = 'https://api.themoviedb.org/3';

class ApiService {
  #API_KEY = '53d591c4c7c46fce2d77997efee7f254';
  page = 1;
  movieId = 0;
  searchQuery = '';

  //вызывайте этот метод по нажатию на логотип/кнопку "Home" (Андрей)
  // вызывайте этот метод, чтобы реализовать подгрузку популярных фильмов на главную  страницу (Вадим)
  async fetchTrendingMovies() {
    const response = await axios.get(
      `/trending/movies/day?api_key=${this.#API_KEY}&page=${this.page}`,
    );
    return response.data;
  }

  //вызывайте этот метод, чтобы получить информацию про фильм по айдишке для модалки (Виктор)
  //вызывайте этот метод, чтобы посмотреть жанры фильмов" (Андрей)
  async fetchMovieDetails() {
    const response = await axios.get(
      `/movie/${this.movieId}?api_key=${this.#API_KEY}&language=en-US`,
    );
    return response.data;
  }
  //вызывайте этот метод, чтобы реализовать поиск фильмов по ключевому слову (Валентин)
  async fetchMovieByKeyword() {
    const response = await axios.get(
      `/search/movie/?api_key=${this.#API_KEY}&query=${
        this.searchQuery
      }&language=en-US&include_adult=false`,
    );
    return response.data;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
}
const api = new ApiService();

export default api;

//не забудьте у себя обработать ошибки через try... catch и выполнить команду npm ci для того чтобы подтянуть axios
