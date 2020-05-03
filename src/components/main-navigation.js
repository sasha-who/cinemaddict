import {getFilmsStatistic} from "../statistic.js";
import AbstractComponent from "./abstract-component.js";

export default class MainNavigation extends AbstractComponent {
  constructor(films) {
    super();

    this._films = films;
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
}
