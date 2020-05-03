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
    this._escapeKeydownHandler = this._escapeKeydownHandler.bind(this);
    this._cardClickHandler = this._cardClickHandler.bind(this);
    this._closeButtonClickHandler = this._closeButtonClickHandler.bind(this);
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
    this._filmCardComponent = new FilmCardComponent(film);
    this._filmDetailedCardComponent = new FilmDetailedCardComponent(film);

    this._filmCardComponent.setCardClickHandler(this._cardClickHandler);
    this._filmDetailedCardComponent.setCloseButtonClickHandler(this._closeButtonClickHandler);

    render(this._filmCardComponent, this._container);
  }
}
