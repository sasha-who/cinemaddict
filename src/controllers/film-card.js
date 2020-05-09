import {Keys, Mode} from "../const.js";
import {generate} from "../utils/common.js";
import {render, appendChild, removeChild, replace, remove} from "../utils/render.js";
import {generateComment} from "../mock/comment.js";
import FilmCardComponent from "../components/film-card.js";
import FilmDetailedCardComponent from "../components/film-details.js";
import CommentComponent from "../components/comment.js";
import CommentsModel from "../models/comments.js";

export default class FilmCardController {
  constructor(film, container, onDataChange, onViewChange) {
    this._film = film;
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._onCommentsChange = this._onCommentsChange.bind(this);
    this._mode = Mode.DEFAULT;
    this._filmCardComponent = null;
    this._filmDetailedCardComponent = null;
    this._bodyElement = document.querySelector(`body`);
    this._escapeKeydownHandler = this._escapeKeydownHandler.bind(this);
    this._commentsModel = new CommentsModel();
    this._comments = generate(this._film.commentsCount, generateComment);
    this._commentsModel.setComments(this._comments);
  }

  _onCardFlagChange(film) {
    const changeCardFlag = (flag) => {
      const newFilm = Object.assign({}, film, {
        [flag]: !film[flag]
      });

      this._onDataChange(this, film, newFilm);
      this._film = newFilm;
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

  _onCommentsChange(film, oldComment, newComment) {
    if (newComment === null) {
      this._commentsModel.removeComment(oldComment.id);
    }

    const newFilm = Object.assign({}, film, {
      commentsCount: this._commentsModel.getComments().length
    });

    this._onDataChange(this, film, newFilm);
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
    const removeComments = () => {
      const commentListElement = this._filmDetailedCardComponent.getElement()
      .querySelector(`.film-details__comments-list`);

      commentListElement.innerHTML = ``;
    };

    const renderComments = () => {
      const commentListElement = this._filmDetailedCardComponent.getElement()
      .querySelector(`.film-details__comments-list`);

      for (const comment of this._commentsModel.getComments()) {
        const commentComponent = new CommentComponent(comment);
        render(commentComponent, commentListElement);
        commentComponent.setCloseButtonClickHandler(() => {
          this._onCommentsChange(film, comment, null);
          this._comments = this._commentsModel.getComments();
        });
      }
    };

    const closeButtonClickHandler = () => {
      this._removePopup();
      removeComments();
    };

    const cardClickHandler = () => {
      removeComments();
      renderComments();
      this._onViewChange();
      appendChild(this._filmDetailedCardComponent, this._bodyElement);
      this._mode = Mode.OPEN;

      this._filmDetailedCardComponent.setCloseButtonClickHandler(closeButtonClickHandler);
      document.addEventListener(`keydown`, this._escapeKeydownHandler);
    };

    const oldFilmCardComponent = this._filmCardComponent;
    this._filmCardComponent = new FilmCardComponent(film);

    const oldFilmDetailedCardComponent = this._filmDetailedCardComponent;
    this._filmDetailedCardComponent = new FilmDetailedCardComponent(film);

    renderComments();
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
