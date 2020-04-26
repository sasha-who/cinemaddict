import {createElement, getSortedFilms} from "../utils.js";

export default class MostCommented {
  constructor(films) {
    this._films = films;
    this._element = null;
  }

  getTemplate() {
    const [mostCommentedFilm] = getSortedFilms(this._films, `commentsCount`);
    const isAnyCommentedFilm = mostCommentedFilm.commentsCount > 0;

    return (
      `${isAnyCommentedFilm ? `<section class="films-list--extra">
      <h2 class="films-list__title">Most commented</h2>

      <div class="films-list__container"></div>
    </section>` : ``}`
    );
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
