import {
  getRandomIntegerNumber,
  getRandomArrayItem,
  shuffleArray,
  getRandomArrayItems,
  castomizeDateFormat
} from "../utils.js";

import {
  randomText,
  FilmsNames,
  Posters,
  Genres,
  Names,
  Country,
  AgeLimits,
  getRandomDate
} from "./temporary-data.js";

import {MONTHS} from "../const.js";
import {generateComments} from "./comments.js";

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
  const sentencesArray = randomText.split(`. `);
  const sentencesCount = getRandomIntegerNumber(MIN_DESCRIPTION_LENGTH, MAX_DESCRIPTION_LENGTH);

  return `${shuffleArray(sentencesArray).slice(0, sentencesCount).join(`. `)}.`;
};

const generateFilm = () => {
  const date = getRandomDate();
  const comments = generateComments(getRandomIntegerNumber(MIN_COMMENTS_COUNT, MAX_COMMENTS_COUNT));

  return {
    name: getRandomArrayItem(FilmsNames),
    poster: getRandomArrayItem(Posters),
    year: date.getFullYear(),
    duration: getFilmDuration(),
    genre: getRandomArrayItems(Genres).join(`, `),
    description: getFilmDescription(),
    comments,
    commentsCount: comments.length,
    isInWatchlist: Math.random() > 0.5,
    isWatched: Math.random() > 0.5,
    isInFavorites: Math.random() > 0.5,
    originalName: getRandomArrayItem(FilmsNames),
    director: getRandomArrayItem(Names),
    screenwriters: getRandomArrayItem(Names),
    rating: getRandomIntegerNumber(MIN_RATING_VALUE, MAX_RATING_VALUE),
    actors: getRandomArrayItems(Names).join(`, `),
    releaseDate: formatFilmDate(date),
    country: getRandomArrayItem(Country),
    ageLimit: getRandomArrayItem(AgeLimits)
  };
};

export const generateFilms = (count) => {
  const films = [];

  for (let i = 0; i < count; i++) {
    films.push(generateFilm());
  }

  return films;
};
