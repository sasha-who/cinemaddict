import {getSortedFilms} from "../utils/common.js";
import AbstractComponent from "./abstract-component.js";

export default class TopRated extends AbstractComponent {
  constructor(films) {
    super();

    this._films = films;
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
}

