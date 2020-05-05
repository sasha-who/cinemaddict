import {FilterType} from "../const.js";

export const getWatchlistFilms = (films) => {
  return films.filter((film) => film.isInWatchlist);
};

export const getWatchedFilms = (films) => {
  return films.filter((film) => film.isWatched);
};

export const getFavoritedFilms = (films) => {
  return films.filter((film) => film.isInFavorites);
};

export const getFilmsByFilter = (films, filterType) => {
  switch (filterType) {
    case FilterType.ALL:
      return films;

    case FilterType.WATCHLIST:
      return getWatchlistFilms(films);

    case FilterType.HISTORY:
      return getWatchedFilms(films);

    case FilterType.FAVORITES:
      return getFavoritedFilms(films);

    default:
      return films;
  }
};
