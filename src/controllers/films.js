import {INITIAL_FILMS_COUNT, ADDITIONAL_FILMS_COUNT, SortType} from "../const.js";
import {getSortedFilms} from "../utils.js";
import {render, remove} from "../render.js";
import SortComponent from "../components/sort.js";
import EmptyFilmsComponent from "../components/empty-films.js";
import FilmsComponent from "../components/films.js";
import ShowMoreButtonComponent from "../components/show-more-button.js";
import TopRatedComponent from "../components/top-rated.js";
import MostCommentedComponent from "../components/most-commented.js";

const getFilmsAfterSorting = (films, sortType) => {
  let sortedFilms = [];

  switch (sortType) {
    case SortType.DATE:
      sortedFilms = films.slice().sort((a, b) => b.date - a.date);
      break;

    case SortType.RATING:
      sortedFilms = films.slice().sort((a, b) => b.rating - a.rating);
      break;

    default:
      sortedFilms = films.slice();
      break;
  }

  return sortedFilms;
};

export default class FilmsController {
  constructor(container) {
    this._films = [];
    this._currentFilmsCount = INITIAL_FILMS_COUNT;
    this._container = container;
    this._sortComponent = new SortComponent();
    this._emptyFilmsComponent = new EmptyFilmsComponent();
    this._filmsComponent = new FilmsComponent();
    this._showMoreButtonComponent = new ShowMoreButtonComponent();
    this._filmsElement = this._filmsComponent.getElement();
    this._filmsListElement = this._filmsElement.querySelector(`.films-list`);
    this._filmsContainerElement = this._filmsListElement.querySelector(`.films-list__container`);
    // this._bodyElement = document.querySelector(`body`);
  }

  _renderInitialCountFilms(films) {
    for (let i = 0; i < INITIAL_FILMS_COUNT; i++) {
      renderCard(films[i], this._filmsContainerElement);
    }
  }

  _renderShowMoreButtonComponent(films) {
    render(this._showMoreButtonComponent, this._filmsListElement);

    this._showMoreButtonComponent.setClickHandler(() => {
      const addedFilmsCount = this._currentFilmsCount + ADDITIONAL_FILMS_COUNT;

      films.slice(this._currentFilmsCount, addedFilmsCount).forEach((item) => {
        renderCard(item, this._filmsContainerElement);
      });

      this._currentFilmsCount = addedFilmsCount;

      if (this._currentFilmsCount >= films.length) {
        remove(this._showMoreButtonComponent);
      }
    });
  }

  _renderSortComponent() {
    this._sortComponent.setSortTypeChangeHandler(() => {
      this._filmsContainerElement.innerHTML = ``;

      const showMoreButton = this._filmsListElement.querySelector(`.films-list__show-more`);

      if (showMoreButton) {
        showMoreButton.remove();
      }

      const sortedFilms = getFilmsAfterSorting(this._films, this._sortComponent.getSortType());
      this._renderInitialCountFilms(sortedFilms);
      this._showMoreButtonComponent.render(sortedFilms);
    });
  }

  _topRatedComponent() {
    const topRatedComponent = new TopRatedComponent(this._films);
    render(topRatedComponent, this._filmsElement);

    const topRatedFilmsContainer = topRatedComponent.getElement()
      .querySelector(`.films-list__container`);

    const topRatedFilms = getSortedFilms(this._films, `rating`);

    for (const film of topRatedFilms) {
      renderCard(film, topRatedFilmsContainer);
    }
  }

  _mostCommentedComponent() {
    const mostCommentedComponent = new MostCommentedComponent(this._films);
    render(mostCommentedComponent, this._filmsElement);

    const mostCommentedFilmsContainer = mostCommentedComponent.getElement()
      .querySelector(`.films-list__container`);

    const mostCommentedFilms = getSortedFilms(this._films, `commentsCount`);

    for (const film of mostCommentedFilms) {
      renderCard(film, mostCommentedFilmsContainer);
    }
  }

  render(films) {
    this._films = films;
    this._renderSortComponent();

    if (this._films.length === 0) {
      render(this._emptyFilmsComponent, this._container);

      return;
    }

    render(this._filmsComponent, this._container);
    this._renderInitialCountFilms(this._films);
    this._renderShowMoreButtonComponent(this._films);
    this._topRatedComponent();
    this._mostCommentedComponent();
  }
}
