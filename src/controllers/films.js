import {INITIAL_FILMS_COUNT, ADDITIONAL_FILMS_COUNT, SortType} from "../const.js";
import {getSortedFilms} from "../utils/common.js";
import {render, remove, replace} from "../utils/render.js";
import EmptyFilmsComponent from "../components/empty-films.js";
import FilmsComponent from "../components/films.js";
import ShowMoreButtonComponent from "../components/show-more-button.js";
import TopRatedComponent from "../components/top-rated.js";
import MostCommentedComponent from "../components/most-commented.js";
import FilmCardController from "../controllers/film-card.js";

const renderFilms = (apiWithProvider, films, container, onDataChange, onViewChange) => {
  return films.map((film) => {
    const filmController = new FilmCardController(
        apiWithProvider,
        film,
        container,
        onDataChange,
        onViewChange
    );

    filmController.initRender(film);

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
  constructor(apiWithProvider, container, filmsModel, sortComponent) {
    this._apiWithProvider = apiWithProvider;
    this._container = container;
    this._filmsModel = filmsModel;
    this._showedBasicFilmsControllers = [];
    this._showedAddFilmsControllers = [];
    this._onViewChange = this._onViewChange.bind(this);
    this._currentFilmsCount = INITIAL_FILMS_COUNT;
    this._onDataChange = this._onDataChange.bind(this);
    this._sortComponent = sortComponent;
    this._emptyFilmsComponent = new EmptyFilmsComponent();
    this._filmsComponent = new FilmsComponent();
    this._showMoreButtonComponent = new ShowMoreButtonComponent();
    this._mostCommentedComponent = null;
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
          this._apiWithProvider,
          sortedFilms,
          this._filmsContainerElement,
          this._onDataChange,
          this._onViewChange
      );

      this._showedBasicFilmsControllers = this._showedBasicFilmsControllers.concat(newFilms);
      this._currentFilmsCount = addedFilmsCount;

      if (this._currentFilmsCount >= films.length) {
        remove(this._showMoreButtonComponent);
      }
    });
  }

  _onSortTypeChange() {
    this._currentFilmsCount = INITIAL_FILMS_COUNT;
    this._removeFilms();

    const sortedFilms = getFilmsAfterSorting(
        this._filmsModel.getFilms(),
        this._sortComponent.getSortType()
    )
      .slice(0, INITIAL_FILMS_COUNT);

    this._renderFilms(sortedFilms);
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
        this._apiWithProvider,
        topRatedFilms,
        topRatedFilmsContainer,
        this._onDataChange,
        this._onViewChange
    );

    this._showedAddFilmsControllers = this._showedAddFilmsControllers.concat(newFilms);
  }

  _renderMostCommentedComponent() {
    const films = this._filmsModel.getFilms();
    const oldMostCommentedComponent = this._mostCommentedComponent;

    this._mostCommentedComponent = new MostCommentedComponent(films);

    if (oldMostCommentedComponent) {
      replace(this._mostCommentedComponent, oldMostCommentedComponent);
    } else {
      render(this._mostCommentedComponent, this._filmsElement);
    }

    const mostCommentedFilmsContainer = this._mostCommentedComponent.getElement()
      .querySelector(`.films-list__container`);

    const mostCommentedFilms = getSortedFilms(films, `commentsCount`);

    const newFilms = renderFilms(
        this._apiWithProvider,
        mostCommentedFilms,
        mostCommentedFilmsContainer,
        this._onDataChange,
        this._onViewChange
    );

    this._showedAddFilmsControllers = this._showedAddFilmsControllers.concat(newFilms);
  }

  _onDataChange(filmCardController, oldData, newData) {
    this._apiWithProvider.updateFilm(oldData.id, newData)
      .then((filmModel) => {
        const isSuccess = this._filmsModel.updateFilm(oldData.id, filmModel);

        if (isSuccess) {
          filmCardController.render(filmModel);

          if (oldData.commentsCount !== newData.commentsCount) {
            this._renderMostCommentedComponent();
          }
        }
      });
  }

  _onViewChange() {
    this._showedBasicFilmsControllers.forEach((item) => item.setDefaultView());
    this._showedAddFilmsControllers.forEach((item) => item.setDefaultView());
  }

  _onFilterChange() {
    this._updateFilms(INITIAL_FILMS_COUNT);
    this._sortComponent.resetSortType();
  }

  _renderFilms(films) {
    const newFilms = renderFilms(
        this._apiWithProvider,
        films,
        this._filmsContainerElement,
        this._onDataChange,
        this._onViewChange
    );

    this._showedBasicFilmsControllers = this._showedBasicFilmsControllers.concat(newFilms);
    this._currentFilmsCount = this._showedBasicFilmsControllers.length;
  }

  _removeFilms() {
    this._showedBasicFilmsControllers.forEach((filmController) => filmController.destroy());
    this._showedBasicFilmsControllers = [];
  }

  _updateFilms(count) {
    this._removeFilms();
    this._renderFilms(this._filmsModel.getFilms().slice(0, count));
    this._renderShowMoreButtonComponent();
  }

  render() {
    const films = this._filmsModel.getFilms();

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

  show() {
    this._sortComponent.show();
    this._filmsComponent.show();
  }

  hide() {
    this._sortComponent.hide();
    this._filmsComponent.hide();
  }
}
