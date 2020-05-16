const isOnline = () => {
  return window.navigator.onLine;
};

export default class Provider {
  constructor(api) {
    this._api = api;
  }

  getFilms() {
    if (isOnline()) {
      return this._api.getFilms();
    }
  }

  getComments(filmId) {
    if (isOnline()) {
      return this._api.getComments(filmId);
    }
  }

  updateFilm(id, data) {
    if (isOnline()) {
      return this._api.updateFilm(id, data);
    }
  }

  createComment(filmId, comment) {
    if (isOnline()) {
      return this._api.createComment(filmId, comment);
    }
  }

  deleteComment(commentId) {
    if (isOnline()) {
      return this._api.deleteComment(commentId);
    }
  }
}
