import moment from "moment";
import {MIN_ID_VALUE, MAX_ID_VALUE} from "../const.js";
import {
  getRandomIntegerNumber,
  getRandomArrayItem,
  shuffleArray,
  getRandomArrayItems
} from "../utils/common.js";

import {
  randomTextElements,
  FILMS_NAMES,
  POSTERS,
  GENRES,
  NAMES,
  COUNTRIES,
  AGE_LIMITS,
  getRandomDate
} from "./temporary-data.js";

const MIN_FILM_DURATION = 30;
const MAX_FILM_DURATION = 240;
const MIN_DESCRIPTION_LENGTH = 1;
const MAX_DESCRIPTION_LENGTH = 5;
const MIN_RATING_VALUE = 0;
const MAX_RATING_VALUE = 10;
const MIN_COMMENTS_COUNT = 0;
const MAX_COMMENTS_COUNT = 5;

const getFilmDuration = () => {
  const randomNumber = getRandomIntegerNumber(MIN_FILM_DURATION, MAX_FILM_DURATION);
  const duration = moment.duration(randomNumber, `minutes`);

  return `${duration.hours()}h ${duration.minutes()}m`;
};

const getFilmDescription = () => {
  const sentencesCount = getRandomIntegerNumber(MIN_DESCRIPTION_LENGTH, MAX_DESCRIPTION_LENGTH);

  return `${shuffleArray(randomTextElements).slice(0, sentencesCount).join(` `)}`;
};

export const generateFilm = () => {
  return {
    id: getRandomIntegerNumber(MIN_ID_VALUE, MAX_ID_VALUE),
    name: getRandomArrayItem(FILMS_NAMES),
    poster: getRandomArrayItem(POSTERS),
    date: getRandomDate(),
    duration: getFilmDuration(),
    commentsCount: getRandomIntegerNumber(MIN_COMMENTS_COUNT, MAX_COMMENTS_COUNT),
    genre: getRandomArrayItems(GENRES).join(`, `),
    description: getFilmDescription(),
    isInWatchlist: Math.random() > 0.5,
    isWatched: Math.random() > 0.5,
    isInFavorites: Math.random() > 0.5,
    originalName: getRandomArrayItem(FILMS_NAMES),
    director: getRandomArrayItem(NAMES),
    screenwriters: getRandomArrayItem(NAMES),
    rating: getRandomIntegerNumber(MIN_RATING_VALUE, MAX_RATING_VALUE),
    actors: getRandomArrayItems(NAMES).join(`, `),
    country: getRandomArrayItem(COUNTRIES),
    ageLimit: getRandomArrayItem(AGE_LIMITS)
  };
};
