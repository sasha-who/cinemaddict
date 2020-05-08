import {Keys, Mode} from "../const.js";
import {generate} from "../utils/common.js";
import {render, appendChild, removeChild, replace, remove} from "../utils/render.js";
import {generateComment} from "../mock/comment.js";
import FilmCardComponent from "../components/film-card.js";
import FilmDetailedCardComponent from "../components/film-details.js";
import CommentComponent from "../components/comment.js";
import CommentsModel from "../models/comments.js";

export default class FilmCardController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._mode = Mode.DEFAULT;
    this._filmCardComponent = null;
    this._filmDetailedCardComponent = null;
    this._bodyElement = document.querySelector(`body`);
    this._escapeKeydownHandler = this._escapeKeydownHandler.bind(this);
    this._commentsModel = new CommentsModel();
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

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._removePopup();
    }
  }

  destroy() {
    remove(this._filmCardComponent);
    remove(this._filmDetailedCardComponent);
    document.removeEventListener(`keydown`, this.__escapeKeydownHandler);
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

    const comments = generate(film.commentsCount, generateComment);
    this._commentsModel.setComments(comments);

    const oldFilmCardComponent = this._filmCardComponent;
    this._filmCardComponent = new FilmCardComponent(film);

    const oldFilmDetailedCardComponent = this._filmDetailedCardComponent;
    this._filmDetailedCardComponent = new FilmDetailedCardComponent(film);

    const commentListElement = this._filmDetailedCardComponent.getElement()
      .querySelector(`.film-details__comments-list`);

    for (const comment of this._commentsModel.getComments()) {
      render(new CommentComponent(comment), commentListElement);
    }

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
