import {EXTRA_FILM_COUNT} from "../const.js";
import {shuffleArray} from "../utils.js";
import {createFilmCardTemplate} from "./film-card";

export const createTopRatedTemplate = (films) => {
  const filmsSortedByRating = films
    .sort((a, b) => Math.sign(b.rating - a.rating));

  let resultedFilms = filmsSortedByRating.slice(0, EXTRA_FILM_COUNT);

  const [firstFilm] = films;
  const isEqual = films.every((item) => item.rating === firstFilm.rating);

  if (isEqual) {
    resultedFilms = shuffleArray(films).slice(0, EXTRA_FILM_COUNT);
  }

  const [topRatedFilm] = filmsSortedByRating;
  const isAnyRatedFilm = topRatedFilm.rating > 0;

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
