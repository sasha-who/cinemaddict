import {Keys} from "../const.js";
import {render, appendChild, removeChild} from "../render.js";
import FilmCardComponent from "../components/film-card.js";
import FilmDetailedCardComponent from "../components/film-details.js";


export default class FilmCardController {
  constructor(container) {
    this._container = container;
    this._filmDetailedCardComponent = null;
    this._filmCardComponent = null;
    this._bodyElement = document.querySelector(`body`);
  }

  _escapeKeydownHandler(evt) {
    if (evt.key === Keys.ESCAPE) {
      removeChild(this._filmDetailedCardComponent, this._bodyElement);

      document.removeEventListener(`keydown`, this._escapeKeydownHandler);
    }
  }

  _cardClickHandler() {
    appendChild(this._filmDetailedCardComponent, this._bodyElement);

    document.addEventListener(`keydown`, this._escapeKeydownHandler);
  }

  _closeButtonClickHandler() {
    removeChild(this._filmDetailedCardComponent, this._bodyElement);

    document.removeEventListener(`keydown`, this._escapeKeydownHandler);
  }

  render(film) {
    const filmCardComponent = new FilmCardComponent(film);
    const filmDetailedCardComponent = new FilmDetailedCardComponent(film);

    filmCardComponent.setCardClickHandler(this._cardClickHandler);
    filmDetailedCardComponent.setCloseButtonClickHandler(this._closeButtonClickHandler);

    render(filmCardComponent, this._container);
  }
}
