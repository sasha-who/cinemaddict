import {Status, RequestMethod} from "../const.js";
import Film from "../models/film.js";
import Comment from "../models/comment.js";

const checkStatus = (response) => {
  if (response.status >= Status.SUCCESS && response.status < Status.REDIRECT) {
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

    return fetch(`https://11.ecmascript.pages.academy/cinemaddict/movies`, {headers})
      .then(checkStatus)
      .then((response) => response.json())
      .then(Film.parseFilms);
  }

  getComments(filmId) {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);

    return fetch(`https://11.ecmascript.pages.academy/cinemaddict/comments/${filmId}`, {headers})
      .then(checkStatus)
      .then((response) => response.json())
      .then(Comment.parseComments);
  }

  updateFilm(id, data) {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);
    headers.append(`Content-Type`, `application/json`);

    return fetch(`https://11.ecmascript.pages.academy/cinemaddict/movies/${id}`,
        {
          method: RequestMethod.PUT,
          body: JSON.stringify(data.toRAW()),
          headers,
        })
      .then(checkStatus)
      .then((response) => response.json())
      .then(Film.parseFilm);
  }

  createComment(filmId, comment) {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);
    headers.append(`Content-Type`, `application/json`);

    return fetch(`https://11.ecmascript.pages.academy/cinemaddict/comments/${filmId}`,
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
      });
  }

  deleteComment(commentId) {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);

    return fetch(`https://11.ecmascript.pages.academy/cinemaddict/comments/${commentId}`,
        {
          method: RequestMethod.DELETE,
          headers,
        });
  }
}
