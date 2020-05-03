import {INITIAL_FILMS_COUNT, ADDITIONAL_FILMS_COUNT, SortType} from "../const.js";
import {getSortedFilms} from "../utils.js";
import {render, remove} from "../render.js";
import SortComponent from "../components/sort.js";
import EmptyFilmsComponent from "../components/empty-films.js";
import FilmsComponent from "../components/films.js";
import ShowMoreButtonComponent from "../components/show-more-button.js";
import TopRatedComponent from "../components/top-rated.js";
import MostCommentedComponent from "../components/most-commented.js";
import FilmCardController from "../controllers/film-card.js";

const renderFilms = (films, container, onDataChange) => {
  return films.map((film) => {
    const filmController = new FilmCardController(container, onDataChange);

    filmController.render(film);

    return filmController;
  });
};

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
    this._showedFilmsControllers = [];
    this._currentFilmsCount = INITIAL_FILMS_COUNT;
    this._onDataChange = this._onDataChange.bind(this);
    this._container = container;
    this._sortComponent = new SortComponent();
    this._emptyFilmsComponent = new EmptyFilmsComponent();
    this._filmsComponent = new FilmsComponent();
    this._showMoreButtonComponent = new ShowMoreButtonComponent();
    this._filmsElement = this._filmsComponent.getElement();
    this._filmsListElement = this._filmsElement.querySelector(`.films-list`);
    this._filmsContainerElement = this._filmsListElement.querySelector(`.films-list__container`);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
  }

  _renderShowMoreButtonComponent() {
    render(this._showMoreButtonComponent, this._filmsListElement);

    this._showMoreButtonComponent.setClickHandler(() => {
      const addedFilmsCount = this._currentFilmsCount + ADDITIONAL_FILMS_COUNT;

      const sortedFilms = getFilmsAfterSorting(this._films, this._sortComponent.getSortType())
        .slice(this._currentFilmsCount, addedFilmsCount);
      const newFilms = renderFilms(sortedFilms, this._filmsContainerElement, this._onDataChange);

      this._showedFilmsControllers = this._showedFilmsControllers.concat(newFilms);
      this._currentFilmsCount = addedFilmsCount;

      if (this._currentFilmsCount >= this._films.length) {
        remove(this._showMoreButtonComponent);
      }
    });
  }

  _onSortTypeChange() {
    this._currentFilmsCount = INITIAL_FILMS_COUNT;

    this._filmsContainerElement.innerHTML = ``;

    if (this._showMoreButtonComponent.getElement()) {
      remove(this._showMoreButtonComponent);
    }

    const sortedFilms = getFilmsAfterSorting(this._films, this._sortComponent.getSortType())
      .slice(0, INITIAL_FILMS_COUNT);

    const newFilms = renderFilms(sortedFilms, this._filmsContainerElement, this._onDataChange);
    this._showedFilmsControllers = newFilms;

    this._renderShowMoreButtonComponent();
  }

  _renderTopRatedComponent() {
    const topRatedComponent = new TopRatedComponent(this._films);
    render(topRatedComponent, this._filmsElement);

    const topRatedFilmsContainer = topRatedComponent.getElement()
      .querySelector(`.films-list__container`);

    const topRatedFilms = getSortedFilms(this._films, `rating`);
    const newFilms = renderFilms(topRatedFilms, topRatedFilmsContainer, this._onDataChange);

    this._showedFilmsControllers = this._showedFilmsControllers.concat(newFilms);
  }

  _renderMostCommentedComponent() {
    const mostCommentedComponent = new MostCommentedComponent(this._films);
    render(mostCommentedComponent, this._filmsElement);

    const mostCommentedFilmsContainer = mostCommentedComponent.getElement()
      .querySelector(`.films-list__container`);

    const mostCommentedFilms = getSortedFilms(this._films, `commentsCount`);
    const newFilms = renderFilms(mostCommentedFilms, mostCommentedFilmsContainer, this._onDataChange);

    this._showedFilmsControllers = this._showedFilmsControllers.concat(newFilms);
  }

  _onDataChange(filmController, oldData, newData) {
    const index = this._films.findIndex((item) => item === oldData);

    if (index === -1) {
      return;
    }

    this._films = [].concat(this._films.slice(0, index), newData, this._films.slice(index + 1));
    filmController.render(this._films[index]);
  }

  render(films) {
    this._films = films;

    const mainElement = document.querySelector(`main`);

    render(this._sortComponent, mainElement);
    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);

    if (this._films.length === 0) {
      render(this._emptyFilmsComponent, this._container);

      return;
    }

    render(this._filmsComponent, this._container);

    const initialFilms = this._films.slice(0, INITIAL_FILMS_COUNT);
    const newFilms = renderFilms(initialFilms, this._filmsContainerElement, this._onDataChange);
    this._showedFilmsControllers = newFilms;

    this._renderShowMoreButtonComponent();
    this._renderTopRatedComponent();
    this._renderMostCommentedComponent();
  }
}
