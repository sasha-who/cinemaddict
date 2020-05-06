import {INITIAL_FILMS_COUNT, ADDITIONAL_FILMS_COUNT, SortType} from "../const.js";
import {getSortedFilms} from "../utils/common.js";
import {render, remove} from "../utils/render.js";
import SortComponent from "../components/sort.js";
import EmptyFilmsComponent from "../components/empty-films.js";
import FilmsComponent from "../components/films.js";
import ShowMoreButtonComponent from "../components/show-more-button.js";
import TopRatedComponent from "../components/top-rated.js";
import MostCommentedComponent from "../components/most-commented.js";
import FilmCardController from "../controllers/film-card.js";

const renderFilms = (films, container, onDataChange, onViewChange) => {
  return films.map((film) => {
    const filmController = new FilmCardController(container, onDataChange, onViewChange);

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
  constructor(container, filmsModel) {
    this._container = container;
    this._filmsModel = filmsModel;
    this._showedFilmsControllers = [];
    this._onViewChange = this._onViewChange.bind(this);
    this._currentFilmsCount = INITIAL_FILMS_COUNT;
    this._onDataChange = this._onDataChange.bind(this);
    this._sortComponent = new SortComponent();
    this._emptyFilmsComponent = new EmptyFilmsComponent();
    this._filmsComponent = new FilmsComponent();
    this._showMoreButtonComponent = new ShowMoreButtonComponent();
    this._filmsElement = this._filmsComponent.getElement();
    this._filmsListElement = this._filmsElement.querySelector(`.films-list`);
    this._filmsContainerElement = this._filmsListElement.querySelector(`.films-list__container`);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._filmsModel.setFilterChangeHandler(this._onFilterChange);
  }

  _renderShowMoreButtonComponent() {
    const films = this._filmsModel.getFilms();

    remove(this._showMoreButtonComponent);
    render(this._showMoreButtonComponent, this._filmsListElement);

    this._showMoreButtonComponent.setClickHandler(() => {
      const addedFilmsCount = this._currentFilmsCount + ADDITIONAL_FILMS_COUNT;

      const sortedFilms = getFilmsAfterSorting(films, this._sortComponent.getSortType())
        .slice(this._currentFilmsCount, addedFilmsCount);

      const newFilms = renderFilms(
          sortedFilms,
          this._filmsContainerElement,
          this._onDataChange,
          this._onViewChange
      );

      this._showedFilmsControllers = this._showedFilmsControllers.concat(newFilms);
      this._currentFilmsCount = addedFilmsCount;

      if (this._currentFilmsCount >= films.length) {
        remove(this._showMoreButtonComponent);
      }
    });
  }

  _onSortTypeChange() {
    this._currentFilmsCount = INITIAL_FILMS_COUNT;

    this._filmsContainerElement.innerHTML = ``;

    const sortedFilms = getFilmsAfterSorting(
        this._filmsModel.getFilms(),
        this._sortComponent.getSortType()
    )
      .slice(0, INITIAL_FILMS_COUNT);

    const newFilms = renderFilms(
        sortedFilms,
        this._filmsContainerElement,
        this._onDataChange,
        this._onViewChange
    );

    this._showedFilmsControllers = newFilms;

    this._renderShowMoreButtonComponent();
  }

  _renderTopRatedComponent() {
    const films = this._filmsModel.getFilms();
    const topRatedComponent = new TopRatedComponent(films);
    render(topRatedComponent, this._filmsElement);

    const topRatedFilmsContainer = topRatedComponent.getElement()
      .querySelector(`.films-list__container`);

    const topRatedFilms = getSortedFilms(films, `rating`);

    const newFilms = renderFilms(
        topRatedFilms,
        topRatedFilmsContainer,
        this._onDataChange,
        this._onViewChange
    );

    this._showedFilmsControllers = this._showedFilmsControllers.concat(newFilms);
  }

  _renderMostCommentedComponent() {
    const films = this._filmsModel.getFilms();
    const mostCommentedComponent = new MostCommentedComponent(films);
    render(mostCommentedComponent, this._filmsElement);

    const mostCommentedFilmsContainer = mostCommentedComponent.getElement()
      .querySelector(`.films-list__container`);

    const mostCommentedFilms = getSortedFilms(films, `commentsCount`);

    const newFilms = renderFilms(
        mostCommentedFilms,
        mostCommentedFilmsContainer,
        this._onDataChange,
        this._onViewChange
    );

    this._showedFilmsControllers = this._showedFilmsControllers.concat(newFilms);
  }

  _onDataChange(filmCardController, oldData, newData) {
    const isSuccess = this._filmsModel.updateFilm(oldData.id, newData);

    if (isSuccess) {
      filmCardController.render(newData);
    }
  }

  _onViewChange() {
    this._showedFilmsControllers.forEach((item) => item.setDefaultView());
  }

  _onFilterChange() {
    this._updateFilms(INITIAL_FILMS_COUNT);
  }

  _renderFilms(films) {
    const newFilms = renderFilms(
        films,
        this._filmsContainerElement,
        this._onDataChange,
        this._onViewChange
    );

    this._showedFilmsControllers = this._showedFilmsControllers.concat(newFilms);
    this._currentFilmsCount = this._showedFilmsControllers.length;
  }

  _removeFilms() {
    this._showedFilmControllers.forEach((filmController) => filmController.destroy());
    this._showedFilmControllers = [];
  }

  _updateFilms(count) {
    this._removeFilms();
    this._renderFilms(this._filmsModel.getFilms().slice(0, count));
    this._renderShowMoreButtonComponent();
  }

  render() {
    const films = this._filmsModel.getFilms();
    const mainElement = document.querySelector(`main`);

    render(this._sortComponent, mainElement);
    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);

    if (films.length === 0) {
      render(this._emptyFilmsComponent, this._container);

      return;
    }

    render(this._filmsComponent, this._container);
    this._renderFilms(films.slice(0, INITIAL_FILMS_COUNT));

    this._renderShowMoreButtonComponent();
    this._renderTopRatedComponent();
    this._renderMostCommentedComponent();
  }
}
