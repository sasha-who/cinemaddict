import {createElement, getSortedFilms} from "../utils.js";

export default class TopRated {
  constructor(films) {
    this._films = films;
    this._element = null;
  }

  getTemplate() {
    const [topRatedFilm] = getSortedFilms(this._films, `rating`);
    const isAnyRatedFilm = topRatedFilm.rating > 0;

    return (
      `${isAnyRatedFilm ? `<section class="films-list--extra">
        <h2 class="films-list__title">Top rated</h2>

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

