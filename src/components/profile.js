import {Rang} from "../const.js";
import {createElement} from "../utils";
import {getFilmsStatistic} from "../statistic.js";

const getRang = (films) => {
  const watchedFilms = getFilmsStatistic(films).isWatched;

  switch (true) {
    case (watchedFilms >= 1 && watchedFilms <= 10):
      return Rang.NOVICE;

    case (watchedFilms >= 11 && watchedFilms <= 20):
      return Rang.FAN;

    case (watchedFilms >= 21):
      return Rang.MOVIE_BUFF;

    default:
      return ``;
  }
};

export default class Profile {
  constructor(films) {
    this._films = films;
    this._element = null;
  }

  getTemplate() {
    return (
      `<section class="header__profile profile">
        <p class="profile__rating">${getRang(this._films)}</p>
        <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      </section>`
    );
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
