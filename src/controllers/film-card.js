import {Keys, Mode} from "../const.js";
import {render, appendChild, removeChild, replace, remove} from "../utils/render.js";
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
    this._escapeKeydownHandler = this._escapeKeydownHandler.bind(this);
    this._closeButtonClickHandler = this._closeButtonClickHandler.bind(this);
    this._cardClickHandler = this._cardClickHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._commentsDelButtonClickHandler = this._commentsDelButtonClickHandler.bind(this);

    this._commentsModel = new CommentsModel();
  }

  _onCardFlagChange(film) {
    const changeCardFlag = (flag) => {
      const newFilm = FilmModel.clone(film);

      newFilm[flag] = !newFilm[flag];
      this._onDataChange(this, film, newFilm);
      this._film = newFilm;
    };

    this._filmCardComponent.setWatchlistButtonHandler((evt) => {
      evt.preventDefault();
      changeCardFlag(`isInWatchlist`);
    });

    this._filmCardComponent.setWatchedButtonHandler((evt) => {
      evt.preventDefault();
      changeCardFlag(`isWatched`);
    });

    this._filmCardComponent.setFavoriteButtonHandler((evt) => {
      evt.preventDefault();
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

  _renderFilmsAfterCommentsChange(film) {
    const newFilm = FilmModel.clone(film);

    newFilm.commentsCount = this._commentsModel.getComments().length;
    this._onDataChange(this, film, newFilm);
    this._film = newFilm;
  }

  _onCommentsChange(film, oldComment, newComment, evt) {
    switch (true) {
      case newComment === null:
        this._filmDetailedCardComponent.onDelButtonChangeCondition(evt, true);

        this._api.deleteComment(oldComment.id)
          .then(() => {
            this._commentsModel.removeComment(oldComment.id);
            this._renderFilmsAfterCommentsChange(film);
          })
          .catch(() => {
            this._filmDetailedCardComponent.onDelButtonChangeCondition(evt, false);
            this._filmDetailedCardComponent.onDeletionError(evt);
          });
        break;

      case oldComment === null:
        this._filmDetailedCardComponent.onFormChangeCondition(true);
        const comment = CommentModel.parseComment(newComment);

        this._api.createComment(film.id, comment)
          .then((comments) => {
            this._filmDetailedCardComponent.onFormChangeCondition(false);
            this._commentsModel.setComments(comments);
            this._renderFilmsAfterCommentsChange(film);
          })
          .catch(() => {
            this._filmDetailedCardComponent.onFormChangeCondition(false);
            this._filmDetailedCardComponent.onCommentError();
          });
        break;
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

  _closeButtonClickHandler() {
    this._removePopup();
  }

  _cardClickHandler() {
    this._onViewChange();
    appendChild(this._filmDetailedCardComponent, this._bodyElement);
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

  _commentsDelButtonClickHandler(evt) {
    const buttons = this._filmDetailedCardComponent.getElement()
      .querySelectorAll(`.film-details__comment-delete`);

    const commentIndex = Array.from(buttons).findIndex((item) => item === evt.target);
    const deletedComment = this._commentsModel.getComments()[commentIndex];
    this._onCommentsChange(this._film, deletedComment, null, evt);
    this._comments = this._commentsModel.getComments();
  }

  _setPopupListeners() {
    this._filmDetailedCardComponent.setCloseButtonClickHandler(this._closeButtonClickHandler);
    this._filmDetailedCardComponent.setFormSubmitHandler(this._formSubmitHandler);
    this._filmDetailedCardComponent
      .setCommentsDelButtonClickHandler(this._commentsDelButtonClickHandler);
    this._onCardFlagChange(this._film);
    this._filmDetailedCardComponent.onCommentEmojiChange();
  }

  initRender(film) {
    this._api.getComments(film.id)
      .then((comments) => {
        this._commentsModel.setComments(comments);
      })
      .then(() => {
        this.render(film);
      })
      .catch(() => {
        this._commentsModel.setComments(0);

        const filmWithoutComments = Object.assign(film, {
          commentsCount: 0
        });

        this.render(filmWithoutComments);

        const commentsErrorComponent = new CommentsErrorComponent();
        const commentsElement = this._filmDetailedCardComponent.getElement()
          .querySelector(`.film-details__comments-list`);

        render(commentsErrorComponent, commentsElement);
      });
  }

  render(film) {
    this._film = film;
    const oldFilmCardComponent = this._filmCardComponent;
    this._filmCardComponent = new FilmCardComponent(film);
    this._filmCardComponent.setCardClickHandler(this._cardClickHandler);

    const oldFilmDetailedCardComponent = this._filmDetailedCardComponent;

    this._filmDetailedCardComponent = new FilmDetailedCardComponent(
        film,
        this._commentsModel.getComments()
    );

    this._setPopupListeners();

    if (oldFilmCardComponent && oldFilmDetailedCardComponent) {
      replace(this._filmCardComponent, oldFilmCardComponent);
      replace(this._filmDetailedCardComponent, oldFilmDetailedCardComponent);
    } else {
      render(this._filmCardComponent, this._container);
    }
  }
}
