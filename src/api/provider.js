export default class Provider {
  constructor(api) {
    this._api = api;
  }

  getFilms() {
    return this._api.getFilms();
  }

  getComments(filmId) {
    return this._api.getComments(filmId);
  }

  updateFilm(id, data) {
    return this._api.updateFilm(id, data);
  }

  createComment(filmId, comment) {
    return this._api.createComment(filmId, comment);
  }

  deleteComment(commentId) {
    return this._api.deleteComment(commentId);
  }
}
