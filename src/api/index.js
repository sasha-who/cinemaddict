import {MAIN_URL, HttpStatus, RequestMethod} from "../const.js";
import Film from "../models/film.js";
import Comment from "../models/comment.js";

const checkStatus = (response) => {
  if (response.status >= HttpStatus.SUCCESS && response.status < HttpStatus.REDIRECT) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

export default class API {
  constructor(authorization) {
    this._authorization = authorization;
  }

  getFilms() {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);

    return fetch(`${MAIN_URL}movies`, {headers})
      .then(checkStatus)
      .then((response) => response.json())
      .then(Film.parseFilms)
      .catch((error) => {
        throw error;
      });
  }

  getComments(filmId) {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);

    return fetch(`${MAIN_URL}comments/${filmId}`, {headers})
      .then(checkStatus)
      .then((response) => response.json())
      .then(Comment.parseComments)
      .catch((error) => {
        throw error;
      });
  }

  updateFilm(id, data) {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);
    headers.append(`Content-Type`, `application/json`);

    return fetch(`${MAIN_URL}movies/${id}`,
        {
          method: RequestMethod.PUT,
          body: JSON.stringify(data.toRAW()),
          headers,
        })
      .then(checkStatus)
      .then((response) => response.json())
      .then(Film.parseFilm)
      .catch((error) => {
        throw error;
      });
  }

  createComment(filmId, comment) {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);
    headers.append(`Content-Type`, `application/json`);

    return fetch(`${MAIN_URL}comments/${filmId}`,
        {
          method: RequestMethod.POST,
          body: JSON.stringify(comment.toRAW()),
          headers,
        })
      .then(checkStatus)
      .then((response) => response.json())
      .then((response) => {
        const comments = response.comments;

        return Comment.parseComments(comments);
      })
      .catch((error) => {
        throw error;
      });
  }

  deleteComment(commentId) {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);

    return fetch(`${MAIN_URL}comments/${commentId}`,
        {
          method: RequestMethod.DELETE,
          headers,
        })
      .catch((error) => {
        throw error;
      });
  }

  sync(data) {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);
    headers.append(`Content-Type`, `application/json`);

    return fetch(`${MAIN_URL}movies/sync`,
        {
          method: RequestMethod.POST,
          body: JSON.stringify(data),
          headers,
        })
      .then(checkStatus)
      .then((response) => response.json())
      .catch((error) => {
        throw error;
      });
  }
}
