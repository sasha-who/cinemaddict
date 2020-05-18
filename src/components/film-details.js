import {
  RELEASE_DATE_FORMAT,
  ERROR_BORDER_CLASS,
  SHAKE_CLASS,
  SHAKE_TIMEOUT,
  Keys,
  DeleteButtonText
} from "../const.js";
import {formatFilmDuration} from "../utils/common.js";
import {encode} from "he";
import moment from "moment";
import AbstractSmartComponent from "./abstract-smart-component.js";

const getCommentsMarkup = (comments) => {
  const commentMarkupElements = comments.map((item) => {
    const {comment, emotion, author, date} = item;

    const formatedDate = moment(date).fromNow();

    return (
      `<li class="film-details__comment">
        <span class="film-details__comment-emoji">
          <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
        </span>
        <div>
          <p class="film-details__comment-text">${comment}</p>
          <p class="film-details__comment-info">
            <span class="film-details__comment-author">${author}</span>
            <span class="film-details__comment-day">${formatedDate}</span>
            <button class="film-details__comment-delete">Delete</button>
          </p>
        </div>
      </li>`
    );
  });

  return commentMarkupElements.join(`\n`);
};

export default class FilmDetailedCard extends AbstractSmartComponent {
  constructor(film, comments) {
    super();

    this._film = film;
    this._comments = comments;
    this._closeButtonClickHandler = null;
    this._watchlistButtonHandler = null;
    this._watchedButtonHandler = null;
    this._favoriteButtonHandler = null;
    this._formSubmitHandler = null;
    this._commentsDelButtonClickHandler = null;
    this._emojiType = null;
  }

  getTemplate() {
    const {
      poster,
      name,
      date,
      ageLimit,
      originalName,
      rating,
      director,
      screenwriters,
      actors,
      duration,
      country,
      genres,
      description,
      isInWatchlist,
      isWatched,
      isInFavorites,
      commentsCount
    } = this._film;

    const releaseDate = moment(date).format(RELEASE_DATE_FORMAT);
    const genresWithEnding = (genres.length === 1) ? `Genre` : `Genres`;
    const genresMarkup = genres
      .map((item) => `<span class="film-details__genre">${item}</span>`)
      .join(`\n`);

    const filmsCharacteristics = [
      {name: `Director`, value: director},
      {name: `Writers`, value: screenwriters.join(`, `)},
      {name: `Actors`, value: actors.join(`, `)},
      {name: `Release Date`, value: releaseDate},
      {name: `Runtime`, value: formatFilmDuration(duration)},
      {name: `Country`, value: country},
      {name: genresWithEnding, value: genresMarkup}
    ];

    const filmsCharacteristicsMarkup = filmsCharacteristics
      .map((item) => (
        `<tr class="film-details__row">
          <td class="film-details__term">${item.name}</td>
          <td class="film-details__cell">${item.value}</td>
        </tr>`
      ))
      .join(`\n`);

    const checkControls = (flag) => flag ? `checked` : ``;

    const userEmojiTemplate = (this._emojiType !== null) ?
      `<img src="./images/emoji/${this._emojiType}.png"
      width="55" height="55" alt="emoji-${this._emojiType}">` :
      ``;

    return (
      `<section class="film-details">
        <form class="film-details__inner" action="" method="get">
          <div class="form-details__top-container">
            <div class="film-details__close">
              <button class="film-details__close-btn" type="button">close</button>
            </div>
            <div class="film-details__info-wrap">
              <div class="film-details__poster">
                <img class="film-details__poster-img" src="${poster}" alt="${name}">

                <p class="film-details__age">${ageLimit}+</p>
              </div>

              <div class="film-details__info">
                <div class="film-details__info-head">
                  <div class="film-details__title-wrap">
                    <h3 class="film-details__title">${name}</h3>
                    <p class="film-details__title-original">${originalName}</p>
                  </div>

                  <div class="film-details__rating">
                    <p class="film-details__total-rating">${rating}</p>
                  </div>
                </div>

                <table class="film-details__table">
                  ${filmsCharacteristicsMarkup}
                </table>

                <p class="film-details__film-description">${description}</p>
              </div>
            </div>

            <section class="film-details__controls">
              <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${checkControls(isInWatchlist)}>
              <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

              <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${checkControls(isWatched)}>
              <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

              <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${checkControls(isInFavorites)}>
              <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
            </section>
          </div>

          <div class="form-details__bottom-container">
            <section class="film-details__comments-wrap">
              <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsCount}</span></h3>

              <ul class="film-details__comments-list">
                ${getCommentsMarkup(this._comments)}
              </ul>

              <div class="film-details__new-comment">
                <div for="add-emoji" class="film-details__add-emoji-label">
                  ${userEmojiTemplate}
                </div>

                <label class="film-details__comment-label">
                  <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
                </label>

                <div class="film-details__emoji-list">
                  <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
                  <label class="film-details__emoji-label" for="emoji-smile">
                    <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
                  </label>

                  <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
                  <label class="film-details__emoji-label" for="emoji-sleeping">
                    <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
                  </label>

                  <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
                  <label class="film-details__emoji-label" for="emoji-puke">
                    <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
                  </label>

                  <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
                  <label class="film-details__emoji-label" for="emoji-angry">
                    <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
                  </label>
                </div>
              </div>
            </section>
          </div>
        </form>
      </section>`
    );
  }

  setCloseButtonClickHandler(handler) {
    this.getElement()
    .querySelector(`.film-details__close-btn`)
    .addEventListener(`click`, handler);

    this._closeButtonClickHandler = handler;
  }

  setWatchlistButtonHandler(handler) {
    this.getElement()
      .querySelector(`.film-details__control-label--watchlist`)
      .addEventListener(`click`, handler);

    this._watchlistButtonHandler = handler;
  }

  setWatchedButtonHandler(handler) {
    this.getElement()
      .querySelector(`.film-details__control-label--watched`)
      .addEventListener(`click`, handler);

    this._watchedButtonHandler = handler;
  }

  setFavoriteButtonHandler(handler) {
    this.getElement()
      .querySelector(`.film-details__control-label--favorite`)
      .addEventListener(`click`, handler);

    this._favoriteButtonHandler = handler;
  }

  setCommentsDelButtonClickHandler(handler) {
    const buttonsElements = this.getElement().querySelectorAll(`.film-details__comment-delete`);

    for (const button of buttonsElements) {
      button.addEventListener(`click`, (evt) => {
        evt.preventDefault();

        handler(evt);
      });
    }

    this._commentsDelButtonClickHandler = handler;
  }

  setFormSubmitHandler(handler) {
    const form = this.getElement().querySelector(`.film-details__inner`);

    form.addEventListener(`keydown`, (evt) => {
      if (event.ctrlKey && evt.code === Keys.ENTER) {
        handler();
      }
    });

    this._formSubmitHandler = handler;
  }

  getFormData() {
    const form = this.getElement().querySelector(`.film-details__inner`);
    const formData = new FormData(form);

    return this._parseFormData(formData);
  }

  _parseFormData(formData) {
    return {
      comment: encode(formData.get(`comment`)),
      emotion: this._emojiType,
      date: new Date()
    };
  }

  recoveryListeners() {
    this.setCloseButtonClickHandler(this._closeButtonClickHandler);
    this.setWatchlistButtonHandler(this._watchlistButtonHandler);
    this.setWatchedButtonHandler(this._watchedButtonHandler);
    this.setFavoriteButtonHandler(this._favoriteButtonHandler);
    this.setCommentsDelButtonClickHandler(this._commentsDelButtonClickHandler);
    this.setFormSubmitHandler(this._formSubmitHandler);
    this.onCommentEmojiChange();
  }

  rerender() {
    super.rerender();
  }

  onCommentEmojiChange() {
    const emojiLabels = this.getElement().querySelectorAll(`.film-details__emoji-label`);
    const emojiInputs = this.getElement().querySelectorAll(`.film-details__emoji-item`);

    emojiLabels.forEach((item, index) => {
      item.addEventListener(`click`, () => {
        const isInputDisabled = Array.from(emojiInputs).some((input) => input.disabled === true);

        if (isInputDisabled) {
          return;
        }

        this._emojiType = emojiInputs[index].value;
        this.rerender();
      });
    });
  }

  _shakeOnError(element) {
    element.classList.add(SHAKE_CLASS);

    setTimeout(() => {
      element.classList.remove(SHAKE_CLASS);
    }, SHAKE_TIMEOUT);
  }

  onNewCommentChangeCondition(isDisabled) {
    const textInput = this.getElement().querySelector(`.film-details__comment-input`);
    const emojiInputs = this.getElement().querySelectorAll(`.film-details__emoji-item`);

    textInput.disabled = isDisabled;

    for (const input of emojiInputs) {
      input.disabled = isDisabled;
    }
  }

  onFormChangeCondition(isDisabled) {
    this.onNewCommentChangeCondition(isDisabled);

    const deleteButtonsElements = this.getElement()
      .querySelectorAll(`.film-details__comment-delete`);

    for (const button of deleteButtonsElements) {
      button.disabled = isDisabled;
    }
  }

  onCommentError() {
    const form = this.getElement().querySelector(`.film-details__inner`);
    const textInput = this.getElement().querySelector(`.film-details__comment-input`);

    textInput.classList.add(ERROR_BORDER_CLASS);
    this._shakeOnError(form);
  }

  onDelButtonChangeCondition(evt, isDeleting) {
    const deleteButton = evt.target;

    if (isDeleting) {
      deleteButton.disabled = true;
      deleteButton.textContent = DeleteButtonText.DELETING;

      return;
    }

    deleteButton.disabled = false;
    deleteButton.textContent = DeleteButtonText.DELETE;
  }

  onDeletionError(evt) {
    const commentsElements = this.getElement().querySelectorAll(`.film-details__comment`);

    for (const comment of commentsElements) {
      if (comment.contains(evt.target)) {
        this._shakeOnError(comment);
      }
    }
  }
}
