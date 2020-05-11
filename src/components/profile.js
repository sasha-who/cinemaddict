import AbstractComponent from "./abstract-component.js";
import {getUserRang} from "../utils/common.js";

export default class Profile extends AbstractComponent {
  constructor(filmsModel) {
    super();

    this._filmsModel = filmsModel;
  }

  getTemplate() {
    const films = this._filmsModel.getFilms();

    return (
      `<section class="header__profile profile">
        <p class="profile__rating">${getUserRang(films)}</p>
        <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      </section>`
    );
  }
}
