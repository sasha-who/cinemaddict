import {INITIAL_FILMS_COUNT, ADDITIONAL_FILMS_COUNT, Keys} from "../const.js";
import {getSortedFilms} from "../utils.js";
import {render, remove, appendChild, removeChild} from "../render.js";
import EmptyFilmsComponent from "../components/empty-films.js";
import FilmsComponent from "../components/films.js";
import FilmCardComponent from "../components/film-card.js";
import ShowMoreButtonComponent from "../components/show-more-button.js";
import TopRatedComponent from "../components/top-rated.js";
import MostCommentedComponent from "../components/most-commented.js";
import FilmDetailedCardComponent from "../components/film-details.js";

const bodyElement = document.querySelector(`body`);

const renderCard = (film, container) => {
  const filmCardComponent = new FilmCardComponent(film);
  const filmDetailedCardComponent = new FilmDetailedCardComponent(film);

  const escapeKeydownHandler = (evt) => {
    if (evt.key === Keys.ESCAPE) {
      removeChild(filmDetailedCardComponent, bodyElement);

      document.removeEventListener(`keydown`, escapeKeydownHandler);
    }
  };

  const cardClickHandler = () => {
    appendChild(filmDetailedCardComponent, bodyElement);

    document.addEventListener(`keydown`, escapeKeydownHandler);
  };

  const closeButtonClickHandler = () => {
    removeChild(filmDetailedCardComponent, bodyElement);

    document.removeEventListener(`keydown`, escapeKeydownHandler);
  };

  filmCardComponent.setCardClickHandler(cardClickHandler);
  filmDetailedCardComponent.setCloseButtonClickHandler(closeButtonClickHandler);

  render(filmCardComponent, container);
};

export default class FilmsController {
  constructor(container) {
    this._container = container;
    this._emptyFilmsComponent = new EmptyFilmsComponent();
    this._filmsComponent = new FilmsComponent();
    this._showMoreButtonComponent = new ShowMoreButtonComponent();
  }

  render(films) {
    if (films.length === 0) {
      render(this._emptyFilmsComponent, this._container);

      return;
    }

    render(this._filmsComponent, this._container);

    const filmsElement = this._filmsComponent.getElement();
    const filmsListElement = filmsElement.querySelector(`.films-list`);
    const filmsContainerElement = filmsListElement.querySelector(`.films-list__container`);

    for (let i = 0; i < INITIAL_FILMS_COUNT; i++) {
      renderCard(films[i], filmsContainerElement);
    }

    render(this._showMoreButtonComponent, filmsListElement);

    let currentFilmsCount = INITIAL_FILMS_COUNT;

    this._showMoreButtonComponent.setClickHandler(() => {
      const addedFilmsCount = currentFilmsCount + ADDITIONAL_FILMS_COUNT;

      films.slice(currentFilmsCount, addedFilmsCount).forEach((item) => {
        renderCard(item, filmsContainerElement);
      });

      currentFilmsCount = addedFilmsCount;

      if (currentFilmsCount >= films.length) {
        remove(this._showMoreButtonComponent);
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
