export const INITIAL_FILMS_COUNT = 5;
export const ADDITIONAL_FILMS_COUNT = 5;
export const EXTRA_FILM_COUNT = 2;
export const MAX_DESCRIPTION_LENGTH = 140;
export const MIN_ID_VALUE = 1;
export const MAX_ID_VALUE = 1000;
export const HIDDEN_CLASS = `visually-hidden`;
export const STATISTIC_HREF = `stats`;
export const MINUTES_IN_HOUR = 60;
export const RELEASE_DATE_FORMAT = `DD MMMM YYYY`;
export const AUTHORIZATION = `Basic sjdkfjhskdjfhksjhfdkshf`;
export const ERROR_BORDER_CLASS = `error-border`;
export const SHAKE_CLASS = `shake`;
export const SHAKE_TIMEOUT = 600;
export const STORE_PREFIX = `cinemaddict-localstorage`;
export const STORE_VER = `v1`;
export const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;
export const BAR_HEIGHT = 50;
export const MAIN_URL = `https://11.ecmascript.pages.academy/cinemaddict/`;

export const MONTHS = [
  `January`,
  `February`,
  `March`,
  `April`,
  `May`,
  `June`,
  `July`,
  `August`,
  `September`,
  `October`,
  `November`,
  `December`
];

export const FLAGS = [
  `isInWatchlist`,
  `isWatched`,
  `isInFavorites`
];

export const Rang = {
  NOVICE: `novice`,
  FAN: `fan`,
  MOVIE_BUFF: `movie buff`
};

export const RangValue = {
  MIN: 1,
  MEDIUM: 10,
  MAX: 20
};

export const RenderPosition = {
  BEFOREEND: `beforeend`,
  AFTERBEGIN: `afterbegin`
};

export const Key = {
  ESCAPE: `Escape`,
  ENTER: `Enter`
};

export const SortType = {
  DEFAULT: `default`,
  DATE: `date`,
  RATING: `rating`
};

export const Mode = {
  DEFAULT: `default`,
  OPEN: `open`
};

export const FilterType = {
  ALL: `all`,
  WATCHLIST: `watchlist`,
  HISTORY: `history`,
  FAVORITES: `favorites`
};

export const Filters = [
  {name: `All movies`, value: FilterType.ALL},
  {name: `Watchlist`, value: FilterType.WATCHLIST},
  {name: `History`, value: FilterType.HISTORY},
  {name: `Favorites`, value: FilterType.FAVORITES}
];

export const NAMES = [
  `John Smith`,
  `Chuck Taylor`,
  `Harry Wilson`,
  `Jane Brown`,
  `Lily Evans`,
  `James Miller`
];

export const RequestMethod = {
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

export const HttpStatus = {
  SUCCESS: 200,
  REDIRECT: 300
};

export const DeleteButtonText = {
  DELETE: `Delete`,
  DELETING: `Deleting…`
};

export const StatisticPeriod = {
  ALL: `all-time`,
  TODAY: `today`,
  WEEK: `week`,
  MONTH: `month`,
  YEAR: `year`
};

export const StatisticFilters = [
  {name: `All time`, value: StatisticPeriod.ALL, isChecked: true},
  {name: `Today`, value: StatisticPeriod.TODAY, isChecked: false},
  {name: `Week`, value: StatisticPeriod.WEEK, isChecked: false},
  {name: `Month`, value: StatisticPeriod.MONTH, isChecked: false},
  {name: `Year`, value: StatisticPeriod.YEAR, isChecked: false},
];
