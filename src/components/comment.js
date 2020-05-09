import AbstractComponent from "../components/abstract-component.js";

export default class Comment extends AbstractComponent {
  constructor(comment) {
    super();

    this._comment = comment;
  }

  getTemplate() {
    const {content, emotion, author, date} = this._comment;

    return (
      `<li class="film-details__comment">
        <span class="film-details__comment-emoji">
          <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
        </span>
        <div>
          <p class="film-details__comment-text">${content}</p>
          <p class="film-details__comment-info">
            <span class="film-details__comment-author">${author}</span>
            <span class="film-details__comment-day">${date}</span>
            <button class="film-details__comment-delete">Delete</button>
          </p>
        </div>
      </li>`
    );
  }

  setCloseButtonClickHandler(handler) {
    this.getElement()
      .querySelector(`.film-details__comment-delete`)
      .addEventListener(`click`, (evt) => {
        evt.preventDefault();

        handler();
      });
  }
}
