import {MAX_DESCRIPTION_LENGTH} from "../const.js";
import {formatFilmDuration} from "../utils/common.js";
import AbstractComponent from "./abstract-component.js";

export default class FilmCard extends AbstractComponent {
  constructor(film) {
    super();

    this._film = film;
  }

  getTemplate() {
    const {
      name,
      rating,
      date,
      duration,
      genres,
      poster,
      description,
      isInWatchlist,
      isWatched,
      isInFavorites,
      commentsCount
    } = this._film;

    const year = date.getFullYear();

    const shortedDescription = (description.length > MAX_DESCRIPTION_LENGTH) ?
      `${description.slice(0, MAX_DESCRIPTION_LENGTH - 1)}...` :
      description;

    const checkControlsActiveClass = (flag) => flag ? `film-card__controls-item--active` : ``;
    const commentEnding = (commentsCount === 1) ? `comment` : `comments`;
    const genresList = genres.join(`, `);

    return (
      `<article class="film-card">
        <h3 class="film-card__title">${name}</h3>
        <p class="film-card__rating">${rating}</p>
        <p class="film-card__info">
          <span class="film-card__year">${year}</span>
          <span class="film-card__duration">${formatFilmDuration(duration)}</span>
          <span class="film-card__genre">${genresList}</span>
        </p>
        <img src="${poster}" alt="${name}" class="film-card__poster">
        <p class="film-card__description">${shortedDescription}</p>
        <a class="film-card__comments">${commentsCount} ${commentEnding}</a>
        <form class="film-card__controls">
          <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${checkControlsActiveClass(isInWatchlist)}">Add to watchlist</button>
          <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${checkControlsActiveClass(isWatched)}">Mark as watched</button>
          <button class="film-card__controls-item button film-card__controls-item--favorite ${checkControlsActiveClass(isInFavorites)}">Mark as favorite</button>
        </form>
      </article>`
    );
  }

  setCardClickHandler(handler) {
    this.getElement()
    .querySelector(`.film-card__poster`)
    .addEventListener(`click`, handler);

    this.getElement()
    .querySelector(`.film-card__title`)
    .addEventListener(`click`, handler);

    this.getElement()
    .querySelector(`.film-card__comments`)
    .addEventListener(`click`, handler);
  }

  setWatchlistButtonHandler(handler) {
    this.getElement()
      .querySelector(`.film-card__controls-item--add-to-watchlist`)
      .addEventListener(`click`, handler);
  }

  setWatchedButtonHandler(handler) {
    this.getElement()
      .querySelector(`.film-card__controls-item--mark-as-watched`)
      .addEventListener(`click`, handler);
  }

  setFavoriteButtonHandler(handler) {
    this.getElement()
      .querySelector(`.film-card__controls-item--favorite`)
      .addEventListener(`click`, handler);
  }
}
