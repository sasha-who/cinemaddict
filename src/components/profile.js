import {Rang} from "../const.js";
import {createElement} from "../utils";
import {getFilmsStatistic} from "../statistic.js";

export default class Profile {
  constructor(films) {
    this._films = films;
    this._element = null;
  }

  getTemplate() {
    let rang;
    const watchedFilms = getFilmsStatistic(this._films).isWatched;

    switch (true) {
      case (watchedFilms >= 1 && watchedFilms <= 10):
        rang = Rang.NOVICE;
        break;

      case (watchedFilms >= 11 && watchedFilms <= 20):
        rang = Rang.FAN;
        break;

      case (watchedFilms >= 21):
        rang = Rang.MOVIE_BUFF;
        break;

      default:
        rang = ``;
    }

    return (
      `<section class="header__profile profile">
        <p class="profile__rating">${rang}</p>
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
