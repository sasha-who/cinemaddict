import {INITIAL_FILMS_COUNT, ADDITIONAL_FILMS_COUNT, SortType} from "../const.js";
import {getSortedFilms} from "../utils.js";
import {render, remove} from "../render.js";
import SortComponent from "../components/sort.js";
import EmptyFilmsComponent from "../components/empty-films.js";
import FilmsComponent from "../components/films.js";
import ShowMoreButtonComponent from "../components/show-more-button.js";
import TopRatedComponent from "../components/top-rated.js";
import MostCommentedComponent from "../components/most-commented.js";

export default class FilmsController {
  constructor(container) {
    this._container = container;
    this._sortComponent = new SortComponent();
    this._emptyFilmsComponent = new EmptyFilmsComponent();
    this._filmsComponent = new FilmsComponent();
  }

  render(films) {
    render(this._sortComponent, this._container);

    if (films.length === 0) {
      render(this._emptyFilmsComponent, this._container);

      return;
    }

    render(this._filmsComponent, this._container);

    const filmsElement = this._filmsComponent.getElement();
    const filmsListElement = filmsElement.querySelector(`.films-list`);
    const filmsContainerElement = filmsListElement.querySelector(`.films-list__container`);
    const bodyElement = document.querySelector(`body`);

    const renderFilms = (allFilms) => {
      for (let i = 0; i < INITIAL_FILMS_COUNT; i++) {
        renderCard(allFilms[i], filmsContainerElement);
      }

      const showMoreButtonComponent = new ShowMoreButtonComponent();
      render(showMoreButtonComponent, filmsListElement);

      let currentFilmsCount = INITIAL_FILMS_COUNT;

      showMoreButtonComponent.setClickHandler(() => {
        const addedFilmsCount = currentFilmsCount + ADDITIONAL_FILMS_COUNT;

        allFilms.slice(currentFilmsCount, addedFilmsCount).forEach((item) => {
          renderCard(item, filmsContainerElement);
        });

        currentFilmsCount = addedFilmsCount;

        if (currentFilmsCount >= allFilms.length) {
          remove(showMoreButtonComponent);
        }
      });
    };

    renderFilms(films);

    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      const filmsSortedByDate = films.slice().sort((a, b) => b.date - a.date);
      const filmsSortedByRating = films.slice().sort((a, b) => b.rating - a.rating);

      filmsContainerElement.innerHTML = ``;

      const showMoreButton = filmsListElement.querySelector(`.films-list__show-more`);

      if (showMoreButton) {
        showMoreButton.remove();
      }

      switch (sortType) {
        case SortType.DATE:
          renderFilms(filmsSortedByDate);
          break;

        case SortType.RATING:
          renderFilms(filmsSortedByRating);
          break;

        default:
          renderFilms(films);
          break;
      }
    });

    const topRatedComponent = new TopRatedComponent(films);
    render(topRatedComponent, filmsElement);

    const topRatedFilmsContainer = topRatedComponent.getElement()
      .querySelector(`.films-list__container`);

    const topRatedFilms = getSortedFilms(films, `rating`);

    for (const film of topRatedFilms) {
      renderCard(film, topRatedFilmsContainer);
    }

    const mostCommentedComponent = new MostCommentedComponent(films);
    render(mostCommentedComponent, filmsElement);

    const mostCommentedFilmsContainer = mostCommentedComponent.getElement()
      .querySelector(`.films-list__container`);

    const mostCommentedFilms = getSortedFilms(films, `commentsCount`);

    for (const film of mostCommentedFilms) {
      renderCard(film, mostCommentedFilmsContainer);
    }
  }
}
