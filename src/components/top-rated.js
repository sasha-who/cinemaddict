import {EXTRA_FILM_COUNT} from "../const.js";
import {shuffleArray} from "../utils.js";
import {createFilmCardTemplate} from "./film-card";

export const createTopRatedTemplate = (films) => {
  const filmsSortedByRating = films.sort((a, b) => {
    if (a.rating < b.rating) {
      return 1;
    }

    if (a.rating > b.rating) {
      return -1;
    }

    return 0;
  });

  let resultedFilms = filmsSortedByRating.slice(0, EXTRA_FILM_COUNT);

  let isEqual = true;

  for (const film of films) {
    if (film.rating !== films[0].rating) {
      isEqual = false;
      break;
    }
  }

  if (isEqual) {
    resultedFilms = shuffleArray(films).slice(0, EXTRA_FILM_COUNT);
  }

  const isAnyRatedFilm = (filmsSortedByRating[0].rating > 0) ? true : false;

  const getFilmsMarkup = () => {
    return resultedFilms.map((item) => createFilmCardTemplate(item)).join(`\n`);
  };

  return (
    `${isAnyRatedFilm ? `<section class="films-list--extra">
      <h2 class="films-list__title">Top rated</h2>

      <div class="films-list__container">
        ${getFilmsMarkup()}
      </div>
    </section>` : ``}`
  );
};
