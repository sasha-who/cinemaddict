import {Keys, Mode} from "../const.js";
import {render, appendChild, removeChild, replace} from "../render.js";
import FilmCardComponent from "../components/film-card.js";
import FilmDetailedCardComponent from "../components/film-details.js";

export default class FilmCardController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._mode = Mode.DEFAULT;
    this._filmDetailedCardComponent = null;
    this._filmCardComponent = null;
    this._bodyElement = document.querySelector(`body`);
    this._escapeKeydownHandler = this._escapeKeydownHandler.bind(this);
  }

  _onCardFlagChange(film) {
    const changeCardFlag = (flag) => {
      const newFilm = Object.assign({}, film, {
        [flag]: !film[flag]
      });

      this._onDataChange(this, film, newFilm);
      film = newFilm;
    };

    this._filmCardComponent.setWatchlistButtonHandler(() => {
      changeCardFlag(`isInWatchlist`);
    });

    this._filmCardComponent.setWatchedButtonHandler(() => {
      changeCardFlag(`isWatched`);
    });

    this._filmCardComponent.setFavoriteButtonHandler(() => {
      changeCardFlag(`isInFavorites`);
    });

    this._filmDetailedCardComponent.setWatchlistButtonHandler(() => {
      changeCardFlag(`isInWatchlist`);
    });

    this._filmDetailedCardComponent.setWatchedButtonHandler(() => {
      changeCardFlag(`isWatched`);
    });

    this._filmDetailedCardComponent.setFavoriteButtonHandler(() => {
      changeCardFlag(`isInFavorites`);
    });
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._removePopup();
    }
  }

  _removePopup() {
    removeChild(this._filmDetailedCardComponent, this._bodyElement);
    this._mode = Mode.DEFAULT;

    document.removeEventListener(`keydown`, this._escapeKeydownHandler);
  }

  _escapeKeydownHandler(evt) {
    if (evt.key === Keys.ESCAPE) {
      this._removePopup();
    }
  }

  render(film) {
    const closeButtonClickHandler = () => {
      this._removePopup();
    };

    const cardClickHandler = () => {
      this._onViewChange();
      appendChild(this._filmDetailedCardComponent, this._bodyElement);
      this._mode = Mode.OPEN;

      this._onCardFlagChange(film);
      this._filmDetailedCardComponent.setCloseButtonClickHandler(closeButtonClickHandler);
      document.addEventListener(`keydown`, this._escapeKeydownHandler);
    };

    const oldFilmCardComponent = this._filmCardComponent;
    this._filmCardComponent = new FilmCardComponent(film);

    const oldFilmDetailedCardComponent = this._filmDetailedCardComponent;
    this._filmDetailedCardComponent = new FilmDetailedCardComponent(film);

    this._onCardFlagChange(film);
    this._filmCardComponent.setCardClickHandler(cardClickHandler);
    this._filmDetailedCardComponent.setCloseButtonClickHandler(closeButtonClickHandler);

    if (oldFilmCardComponent && oldFilmDetailedCardComponent) {
      replace(this._filmCardComponent, oldFilmCardComponent);
      replace(this._filmDetailedCardComponent, oldFilmDetailedCardComponent);
    } else {
      render(this._filmCardComponent, this._container);
    }
  }
}
