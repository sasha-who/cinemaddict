import {Rang} from "../const.js";
import {getWatchedFilms} from "../utils/filter.js";
import AbstractComponent from "./abstract-component.js";

const getRang = (films) => {
  const watchedFilmsCount = getWatchedFilms(films).length;

  switch (true) {
    case (watchedFilmsCount >= 1 && watchedFilmsCount <= 10):
      return Rang.NOVICE;

    case (watchedFilmsCount >= 11 && watchedFilmsCount <= 20):
      return Rang.FAN;

    case (watchedFilmsCount >= 21):
      return Rang.MOVIE_BUFF;

    default:
      return ``;
  }
};

export default class Profile extends AbstractComponent {
  constructor(filmsModel) {
    super();

    this._filmsModel = filmsModel;
  }

  getTemplate() {
    const films = this._filmsModel.getFilms();

    return (
      `<section class="header__profile profile">
        <p class="profile__rating">${getRang(films)}</p>
        <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      </section>`
    );
  }
}
