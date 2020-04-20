import {MAX_DESCRIPTION_LENGTH} from "../const.js";

export const createFilmCardTemplate = (film) => {
  const {
    name,
    rating,
    year,
    duration,
    genre,
    poster,
    description,
    commentsCount,
    isInWatchlist,
    isWatched,
    isInFavorites
  } = film;

  const shortedDescription = (description.length > MAX_DESCRIPTION_LENGTH) ?
    `${description.slice(0, MAX_DESCRIPTION_LENGTH - 1)}...` :
    description;
  const checkControlsActiveClass = (flag) => flag ? `film-card__controls-item--active` : ``;
  const commentEnding = (commentsCount === 1) ? `comment` : `comments`;

  return (
    `<article class="film-card">
      <h3 class="film-card__title">${name}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${year}</span>
        <span class="film-card__duration">${duration}</span>
        <span class="film-card__genre">${genre}</span>
      </p>
      <img src="./images/posters/${poster}" alt="${name}" class="film-card__poster">
      <p class="film-card__description">${shortedDescription}</p>
      <a class="film-card__comments">${commentsCount} ${commentEnding}</a>
      <form class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${checkControlsActiveClass(isInWatchlist)}">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${checkControlsActiveClass(isWatched)}">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite ${checkControlsActiveClass(isInFavorites)}">Mark as favorite</button>
      </form>
    </article>`
  );
};
