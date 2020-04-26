import {createElement} from "../utils";
import {getFilmsStatistic} from "../statistic.js";

export default class MainNavigation {
  constructor(films) {
    this._films = films;
    this._element = null;
  }

  getTemplate() {
    const statistic = getFilmsStatistic(this._films);

    return (
      `<nav class="main-navigation">
        <div class="main-navigation__items">
          <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
          <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${statistic.isInWatchlist}</span></a>
          <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${statistic.isWatched}</span></a>
          <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${statistic.isInFavorites}</span></a>
        </div>
        <a href="#stats" class="main-navigation__additional">Stats</a>
      </nav>`
    );
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
