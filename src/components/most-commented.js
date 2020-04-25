import {EXTRA_FILM_COUNT} from "../const.js";
import {shuffleArray, createElement} from "../utils.js";
import {createFilmCardTemplate} from "./film-card";

export default class MostCommented {
  constructor(films) {
    this._films = films;
    this._element = null;
  }

  getTemplate() {
    const filmsSortedByCommentsCount = this._films
    .sort((a, b) => Math.sign(b.commentsCount - a.commentsCount));

    let resultedFilms = filmsSortedByCommentsCount.slice(0, EXTRA_FILM_COUNT);

    const [firstFilm] = this._films;
    const isEqual = this._films.every((item) => item.commentsCount === firstFilm.commentsCount);

    if (isEqual) {
      resultedFilms = shuffleArray(this._films).slice(0, EXTRA_FILM_COUNT);
    }

    const [mostCommentedFilm] = filmsSortedByCommentsCount;
    const isAnyCommentedFilm = mostCommentedFilm.commentsCount > 0;

    const getFilmsMarkup = () => {
      return resultedFilms.map((item) => createFilmCardTemplate(item)).join(`\n`);
    };

    return (
      `${isAnyCommentedFilm ? `<section class="films-list--extra">
      <h2 class="films-list__title">Most commented</h2>

      <div class="films-list__container">
        ${getFilmsMarkup()}
      </div>
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
