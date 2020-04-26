import {Rang} from "../const.js";
import {getFilmsStatistic} from "../statistic.js";

export const createProfileTemplate = (films) => {
  let rang;
  const watchedFilms = getFilmsStatistic(films).isWatched;

  switch (true) {
    case (watchedFilms >= 1 && watchedFilms <= 10):
      rang = Rang.NOVICE;
      break;

    case (watchedFilms >= 11 && watchedFilms <= 20):
      rang = Rang.FAN;
      break;

    case (watchedFilms >= 21):
      rang = Rang.MOVIE_BUFF;
      break;

    default:
      rang = ``;
  }

  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${rang}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};
