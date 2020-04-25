import {generateComment} from "./comment.js";
import {
  getRandomIntegerNumber,
  getRandomArrayItem,
  shuffleArray,
  getRandomArrayItems,
  castomizeDateFormat,
  generate
} from "../utils.js";

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

import {MONTHS} from "../const.js";

const MIN_COMMENTS_COUNT = 0;
const MAX_COMMENTS_COUNT = 5;
const MIN_FILM_DURATION = 30;
const MAX_FILM_DURATION = 240;
const MINUTES_IN_HOUR = 60;
const MIN_DESCRIPTION_LENGTH = 1;
const MAX_DESCRIPTION_LENGTH = 5;
const MIN_RATING_VALUE = 0;
const MAX_RATING_VALUE = 10;

const formatFilmDate = (date) => {
  const year = date.getFullYear();
  const month = MONTHS[date.getMonth()];
  const day = castomizeDateFormat(date.getDate());

  return `${day} ${month} ${year}`;
};

const getFilmDuration = () => {
  const duration = getRandomIntegerNumber(MIN_FILM_DURATION, MAX_FILM_DURATION);
  const minutes = duration % MINUTES_IN_HOUR;
  const hours = (duration - minutes) / MINUTES_IN_HOUR;

  return `${hours}h ${castomizeDateFormat(minutes)}m`;
};

const getFilmDescription = () => {
  const sentencesCount = getRandomIntegerNumber(MIN_DESCRIPTION_LENGTH, MAX_DESCRIPTION_LENGTH);

  return `${shuffleArray(randomTextElements).slice(0, sentencesCount).join(` `)}`;
};

export const generateFilm = () => {
  const date = getRandomDate();
  const commentsCount = getRandomIntegerNumber(MIN_COMMENTS_COUNT, MAX_COMMENTS_COUNT);
  const comments = generate(commentsCount, generateComment);

  return {
    name: getRandomArrayItem(FILMS_NAMES),
    poster: getRandomArrayItem(POSTERS),
    year: date.getFullYear(),
    duration: getFilmDuration(),
    genre: getRandomArrayItems(GENRES).join(`, `),
    description: getFilmDescription(),
    comments,
    commentsCount,
    isInWatchlist: Math.random() > 0.5,
    isWatched: Math.random() > 0.5,
    isInFavorites: Math.random() > 0.5,
    originalName: getRandomArrayItem(FILMS_NAMES),
    director: getRandomArrayItem(NAMES),
    screenwriters: getRandomArrayItem(NAMES),
    rating: getRandomIntegerNumber(MIN_RATING_VALUE, MAX_RATING_VALUE),
    actors: getRandomArrayItems(NAMES).join(`, `),
    releaseDate: formatFilmDate(date),
    country: getRandomArrayItem(COUNTRIES),
    ageLimit: getRandomArrayItem(AGE_LIMITS)
  };
};
