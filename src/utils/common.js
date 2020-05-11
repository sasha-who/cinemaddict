import {EXTRA_FILM_COUNT} from "../const.js";
import {Rang} from "../const.js";
import {getWatchedFilms} from "../utils/filter.js";
import moment from "moment";

export const getRandomIntegerNumber = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getRandomArrayItem = (elements) => {
  const randomIndex = getRandomIntegerNumber(0, elements.length - 1);

  return elements[randomIndex];
};

export const shuffleArray = (elements) => {
  const shuffledArray = elements.slice();

  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }

  return shuffledArray;
};

export const getRandomArrayItems = (elements) => shuffleArray(elements)
  .slice(0, getRandomIntegerNumber(1, elements.length));

export const generate = (count, generatorFunction) => {
  const result = [];

  for (let i = 0; i < count; i++) {
    result.push(generatorFunction());
  }

  return result;
};

export const createElement = (template) => {
  const container = document.createElement(`div`);

  container.innerHTML = template;

  return container.firstChild;
};

export const getSortedFilms = (films, property) => {
  const sortedFilms = films
    .slice()
    .sort((a, b) => Math.sign(b[property] - a[property]));

  let resultedFilms = sortedFilms.slice(0, EXTRA_FILM_COUNT);

  const [firstFilm] = films;
  const isEqual = films.every((item) => item[property] === firstFilm[property]);

  if (isEqual) {
    resultedFilms = shuffleArray(films).slice(0, EXTRA_FILM_COUNT);
  }

  return resultedFilms;
};

export const getElementNameByHref = (href) => {
  const position = href.indexOf(`#`) + 1;

  return href.substring(position);
};

export const getUserRang = (films) => {
  const watchedFilmsCount = getWatchedFilms(films).length;

  switch (true) {
    case (watchedFilmsCount >= 1 && watchedFilmsCount <= 10):
      return Rang.NOVICE;

    case (watchedFilmsCount >= 11 && watchedFilmsCount <= 20):
      return Rang.FAN;

    case (watchedFilmsCount >= 21):
      return Rang.MOVIE_BUFF;

    default:
      return ``;
  }
};

export const formatFilmDuration = (duration) => {
  const durationInMinutes = moment.duration(duration, `minutes`);

  return `${durationInMinutes.hours()}h ${durationInMinutes.minutes()}m`;
};
