import {EXTRA_FILM_COUNT} from "../const.js";
import {shuffleArray} from "../utils.js";
import {createFilmCardTemplate} from "./film-card";

export const createMostCommentedTemplate = (films) => {
  const filmsSortedByCommentsCount = films
    .sort((a, b) => Math.sign(b.commentsCount - a.commentsCount));

  let resultedFilms = filmsSortedByCommentsCount.slice(0, EXTRA_FILM_COUNT);

  const [firstFilm] = films;
  const isEqual = films.every((item) => item.commentsCount === firstFilm.commentsCount);

  if (isEqual) {
    resultedFilms = shuffleArray(films).slice(0, EXTRA_FILM_COUNT);
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
};
