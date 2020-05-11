export default class API {
  getFilms() {
    return fetch(`https://11.ecmascript.pages.academy/cinemaddict/movies`);
  }
}
