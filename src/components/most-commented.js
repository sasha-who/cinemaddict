import {EXTRA_FILM_COUNT} from "../const.js";
import {shuffleArray, createElement} from "../utils.js";

export default class MostCommented {
  constructor(films) {
    this._films = films;
    this._element = null;
  }

  getResultedFilms() {
    const filmsSortedByCommentsCount = this._films
      .slice()
      .sort((a, b) => Math.sign(b.commentsCount - a.commentsCount));

    let resultedFilms = filmsSortedByCommentsCount.slice(0, EXTRA_FILM_COUNT);

    const [firstFilm] = this._films;
    const isEqual = this._films.every((item) => item.commentsCount === firstFilm.commentsCount);

    if (isEqual) {
      resultedFilms = shuffleArray(this._films).slice(0, EXTRA_FILM_COUNT);
    }

    return resultedFilms;
  }

  getTemplate() {
    const [mostCommentedFilm] = this.getResultedFilms();
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
