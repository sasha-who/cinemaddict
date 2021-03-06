import {Key, Mode} from "../const.js";
import {render, appendElementBefore, removeChild, replace, remove} from "../utils/render.js";
import FilmModel from "../models/film.js";
import CommentModel from "../models/comment.js";
import CommentsModel from "../models/comments.js";
import FilmCardComponent from "../components/film-card.js";
import FilmDetailedCardComponent from "../components/film-details.js";
import CommentsErrorComponent from "../components/comments-error.js";

export default class FilmCardController {
  constructor(api, film, container, onDataChange, onViewChange) {
    this._api = api;
    this._film = film;
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._onCommentsChange = this._onCommentsChange.bind(this);
    this._mode = Mode.DEFAULT;
    this._filmCardComponent = null;
    this._filmDetailedCardComponent = null;
    this._bodyElement = document.querySelector(`body`);
    this._footerElement = this._bodyElement.querySelector(`.footer`);
    this._escapeKeydownHandler = this._escapeKeydownHandler.bind(this);
    this._closeButtonClickHandler = this._closeButtonClickHandler.bind(this);
    this._cardClickHandler = this._cardClickHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._commentsDelButtonClickHandler = this._commentsDelButtonClickHandler.bind(this);
    this._isCommentsLoadError = false;

    this._commentsModel = new CommentsModel();
  }

  getId() {
    return this._film.id;
  }

  render(film) {
    if (this._isCommentsLoadError) {
      const filmWithoutComments = Object.assign(film, {
        comments: [],
        commentsCount: 0
      });

      this._renderCard(filmWithoutComments);
      this._renderPopup(filmWithoutComments);
      this._filmDetailedCardComponent.onNewCommentChangeCondition(true);

      const commentsErrorComponent = new CommentsErrorComponent();
      const commentsElement = this._filmDetailedCardComponent.getElement()
        .querySelector(`.film-details__comments-list`);

      render(commentsErrorComponent, commentsElement);

      return;
    }

    this._renderCard(film);
    this._renderPopup(film);
  }

  initRender(film) {
    this._renderCard(film);

    this._api.getComments(film.id)
      .then((comments) => {
        this._commentsModel.set(comments);
      })
      .then(() => {
        this._renderPopup(film);
      })
      .catch(() => {
        this._commentsModel.set(0);
        this._isCommentsLoadError = true;

        this.render(film);
      });
  }

  destroy() {
    remove(this._filmCardComponent);
    remove(this._filmDetailedCardComponent);
    document.removeEventListener(`keydown`, this.__escapeKeydownHandler);
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._removePopup();
    }
  }

  _renderFilmsAfterCommentsChange(film) {
    const newFilm = FilmModel.clone(film);

    newFilm.commentsCount = this._commentsModel.get().length;
    this._onDataChange(this, film, newFilm);
    this._film = newFilm;
  }

  _removePopup() {
    removeChild(this._filmDetailedCardComponent, this._bodyElement);
    this._mode = Mode.DEFAULT;
    this._filmDetailedCardComponent.clearCommentEmoji();

    document.removeEventListener(`keydown`, this._escapeKeydownHandler);
  }

  _renderPopup(film) {
    const oldFilmDetailedCardComponent = this._filmDetailedCardComponent;

    this._filmDetailedCardComponent = new FilmDetailedCardComponent(
        film,
        this._commentsModel.get()
    );

    if (oldFilmDetailedCardComponent) {
      replace(this._filmDetailedCardComponent, oldFilmDetailedCardComponent);

      if (this._mode === Mode.OPEN) {
        this._setPopupListeners();
      }
    }
  }

  _renderCard(film) {
    this._film = film;

    const oldFilmCardComponent = this._filmCardComponent;
    this._filmCardComponent = new FilmCardComponent(film);
    this._filmCardComponent.setCardClickHandler(this._cardClickHandler);

    if (oldFilmCardComponent) {
      replace(this._filmCardComponent, oldFilmCardComponent);
    } else {
      render(this._filmCardComponent, this._container);
    }

    this._onCardFlagChange(this._film);
  }

  _setPopupListeners() {
    this._filmDetailedCardComponent.setCloseButtonClickHandler(this._closeButtonClickHandler);
    this._filmDetailedCardComponent.setFormSubmitHandler(this._formSubmitHandler);
    this._filmDetailedCardComponent
      .setCommentsDelButtonClickHandler(this._commentsDelButtonClickHandler);
    this._onDetailedCardFlagChange(this._film);
    this._onNetworkConditionChange();
    this._filmDetailedCardComponent.onCommentEmojiChange();
  }

  _changeCardFlag(film, flag) {
    const newFilm = FilmModel.clone(film);

    newFilm[flag] = !newFilm[flag];
    this._onDataChange(this, film, newFilm);
    this._film = newFilm;
  }

  _onCardFlagChange(film) {
    this._filmCardComponent.setWatchlistButtonHandler((evt) => {
      evt.preventDefault();
      this._changeCardFlag(film, `isInWatchlist`);
    });

    this._filmCardComponent.setWatchedButtonHandler((evt) => {
      evt.preventDefault();
      film.watchingDate = new Date();
      this._changeCardFlag(film, `isWatched`);
    });

    this._filmCardComponent.setFavoriteButtonHandler((evt) => {
      evt.preventDefault();
      this._changeCardFlag(film, `isInFavorites`);
    });

  }

  _onDetailedCardFlagChange(film) {
    this._filmDetailedCardComponent.setWatchlistButtonHandler(() => {
      this._changeCardFlag(film, `isInWatchlist`);
    });

    this._filmDetailedCardComponent.setWatchedButtonHandler(() => {
      film.watchingDate = new Date();
      this._changeCardFlag(film, `isWatched`);
    });

    this._filmDetailedCardComponent.setFavoriteButtonHandler(() => {
      this._changeCardFlag(film, `isInFavorites`);
    });
  }

  _onCommentsChange(film, oldComment, newComment, evt) {
    switch (true) {
      case newComment === null:
        this._filmDetailedCardComponent.onDelButtonChangeCondition(evt, true);

        this._api.deleteComment(oldComment.id)
          .then(() => {
            this._commentsModel.remove(oldComment.id);
            this._renderFilmsAfterCommentsChange(film);
          })
          .catch(() => {
            this._filmDetailedCardComponent.onDelButtonChangeCondition(evt, false);
            this._filmDetailedCardComponent.onDeletionError(evt);
          });
        break;

      case oldComment === null:
        this._filmDetailedCardComponent.onNewCommentChangeCondition(true);
        const comment = CommentModel.parseComment(newComment);

        this._api.createComment(film.id, comment)
          .then((comments) => {
            this._filmDetailedCardComponent.onNewCommentChangeCondition(false);
            this._commentsModel.set(comments);
            this._renderFilmsAfterCommentsChange(film);
          })
          .catch(() => {
            this._filmDetailedCardComponent.onNewCommentChangeCondition(false);
            this._filmDetailedCardComponent.onCommentError();
          });
        break;
    }
  }

  _onNetworkConditionChange() {
    window.addEventListener(`online`, () => {
      this._filmDetailedCardComponent.onFormChangeCondition(false);
    });

    window.addEventListener(`offline`, () => {
      this._filmDetailedCardComponent.onFormChangeCondition(true);
    });
  }

  _escapeKeydownHandler(evt) {
    if (evt.key === Key.ESCAPE) {
      this._removePopup();
    }
  }

  _closeButtonClickHandler() {
    this._removePopup();
  }

  _cardClickHandler() {
    this._onViewChange();
    appendElementBefore(this._filmDetailedCardComponent, this._footerElement);
    this._mode = Mode.OPEN;
    this._setPopupListeners();

    document.addEventListener(`keydown`, this._escapeKeydownHandler);
  }

  _formSubmitHandler() {
    const data = this._filmDetailedCardComponent.getFormData();

    if (data.comment && data.emotion) {
      this._onCommentsChange(this._film, null, data);
    }
  }

  _commentsDelButtonClickHandler(evt) {
    const buttonElements = this._filmDetailedCardComponent.getElement()
      .querySelectorAll(`.film-details__comment-delete`);

    const commentIndex = Array.from(buttonElements).findIndex((item) => item === evt.target);
    const deletedComment = this._commentsModel.get()[commentIndex];
    this._onCommentsChange(this._film, deletedComment, null, evt);
  }
}
