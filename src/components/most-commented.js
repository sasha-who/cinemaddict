import {EXTRA_FILM_COUNT} from "../const.js";
import {shuffleArray} from "../utils.js";
import {createFilmCardTemplate} from "./film-card";

export const createMostCommentedTemplate = (films) => {
  const filmsSortedByCommentsCount = films.sort((a, b) => {
    if (a.commentsCount < b.commentsCount) {
      return 1;
    }

    if (a.commentsCount > b.commentsCount) {
      return -1;
    }

    return 0;
  });

  let resultedFilms = filmsSortedByCommentsCount.slice(0, EXTRA_FILM_COUNT);

  let isEqual = true;

  for (const film of films) {
    if (film.commentsCount !== films[0].commentsCount) {
      isEqual = false;
      break;
    }
  }

  if (isEqual) {
    resultedFilms = shuffleArray(films).slice(0, EXTRA_FILM_COUNT);
  }

  const isAnyCommentedFilm = (filmsSortedByCommentsCount[0].commentsCount > 0) ? true : false;

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
