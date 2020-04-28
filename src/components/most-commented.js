import {getSortedFilms} from "../utils.js";
import AbstractComponent from "./abstract-component.js";

export default class MostCommented extends AbstractComponent {
  constructor(films) {
    super();

    this._films = films;
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
}
