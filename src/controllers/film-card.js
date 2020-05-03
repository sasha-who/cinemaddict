import {Keys} from "../const.js";
import {render, appendChild, removeChild} from "../render.js";
import FilmCardComponent from "../components/film-card.js";
import FilmDetailedCardComponent from "../components/film-details.js";


export default class FilmCardController {
  constructor(container, onDataChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._film = null;
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

  _closeButtonClickHandler() {
    removeChild(this._filmDetailedCardComponent, this._bodyElement);
    this._filmDetailedCardComponent.setCloseButtonClickHandler(this._closeButtonClickHandler);

    document.removeEventListener(`keydown`, this._escapeKeydownHandler);
  }

  _createFilmDetailedCardComponent(film) {
    this._filmDetailedCardComponent = new FilmDetailedCardComponent(film);
    this._filmDetailedCardComponent.setCloseButtonClickHandler(this._closeButtonClickHandler);

    const changeDetailedCardFlag = (evt, flag) => {
      evt.target.classList.toggle(`film-card__controls-item--active`);

      this._onDataChange(film, Object.assign({}, film, {
        [flag]: !film[flag]
      }));
    };

    this._filmDetailedCardComponent.setWatchlistButtonHandler((evt) => {
      changeDetailedCardFlag(evt, `isInWatchlist`);
    });

    this._filmDetailedCardComponent.setWatchedButtonHandler((evt) => {
      changeDetailedCardFlag(evt, `isWatched`);
    });

    this._filmDetailedCardComponent.setFavoriteButtonHandler((evt) => {
      changeDetailedCardFlag(evt, `isInFavorites`);
    });
  }

  _cardClickHandler() {
    this._createFilmDetailedCardComponent(this._film);
    appendChild(this._filmDetailedCardComponent, this._bodyElement);

    document.addEventListener(`keydown`, this._escapeKeydownHandler);
  }

  render(film) {
    this._film = film;
    this._filmCardComponent = new FilmCardComponent(this._film);

    this._filmCardComponent.setCardClickHandler(this._cardClickHandler);

    const changeCardFlag = (evt, flag) => {
      evt.preventDefault();

      evt.target.classList.toggle(`film-card__controls-item--active`);

      const newFilm = Object.assign({}, this._film, {
        [flag]: !this._film[flag]
      });

      this._onDataChange(this._film, newFilm);
      this._film = newFilm;
    };

    this._filmCardComponent.setWatchlistButtonHandler((evt) => {
      changeCardFlag(evt, `isInWatchlist`);
    });

    this._filmCardComponent.setWatchedButtonHandler((evt) => {
      changeCardFlag(evt, `isWatched`);
    });

    this._filmCardComponent.setFavoriteButtonHandler((evt) => {
      changeCardFlag(evt, `isInFavorites`);
    });
    render(this._filmCardComponent, this._container);
  }
}
