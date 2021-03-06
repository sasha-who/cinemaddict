import {getFilmsByFilter} from "../utils/filter.js";
import {FilterType} from "../const.js";
import FilmModel from "../models/film.js";

export default class Films {
  constructor() {
    this._films = [];
    this._activeFilterType = FilterType.ALL;
    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];
  }

  set(films) {
    this._films = Array.from(films);
    this._callHandlers(this._dataChangeHandlers);
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  getFilms() {
    return this._films;
  }

  getFilteredFilms() {
    return getFilmsByFilter(this._films, this._activeFilterType);
  }

  update(id, film) {
    const index = this._films.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._films[index] = FilmModel.clone(film);
    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
