import {
  MOCK_FILMS_COUNT,
  INITIAL_FILMS_COUNT,
  ADDITIONAL_FILMS_COUNT,
  Keys
} from "./const.js";
import {generate, getSortedFilms} from "./utils.js";
import {render, remove, appendChild, removeChild} from "./render.js";
import {generateFilm} from "./mock/film.js";
import ProfileComponent from "./components/profile.js";
import MainNavigationComponent from "./components/main-navigation.js";
import SortComponent from "./components/sort.js";
import EmptyFilmsComponent from "./components/empty-films.js";
import FilmsComponent from "./components/films.js";
import FilmCardComponent from "./components/film-card.js";
import ShowMoreButtonComponent from "./components/show-more-button.js";
import TopRatedComponent from "./components/top-rated.js";
import MostCommentedComponent from "./components/most-commented.js";
import FilmsStatisticsComponent from "./components/films-statistics.js";
import FilmDetailedCardComponent from "./components/film-details.js";

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

const renderAllFilms = (films) => {
  if (films.length === 0) {
    render(new EmptyFilmsComponent(), mainElement);

    return;
  }

  const filmsComponent = new FilmsComponent();
  render(filmsComponent, mainElement);

  const filmsElement = filmsComponent.getElement();
  const filmsListElement = filmsElement.querySelector(`.films-list`);
  const filmsContainerElement = filmsListElement.querySelector(`.films-list__container`);

  for (let i = 0; i < INITIAL_FILMS_COUNT; i++) {
    renderCard(films[i], filmsContainerElement);
  }

  const showMoreButtonComponent = new ShowMoreButtonComponent();
  render(showMoreButtonComponent, filmsListElement);

  let currentFilmsCount = INITIAL_FILMS_COUNT;

  showMoreButtonComponent.getElement().addEventListener(`click`, () => {
    const addedFilmsCount = currentFilmsCount + ADDITIONAL_FILMS_COUNT;

    films.slice(currentFilmsCount, addedFilmsCount).forEach((item) => {
      renderCard(item, filmsContainerElement);
    });

    currentFilmsCount = addedFilmsCount;

    if (currentFilmsCount >= films.length) {
      remove(showMoreButtonComponent);
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
};

const films = generate(MOCK_FILMS_COUNT, generateFilm);

const bodyElement = document.querySelector(`body`);
const headerElement = bodyElement.querySelector(`.header`);

render(new ProfileComponent(films), headerElement);

const mainElement = bodyElement.querySelector(`.main`);

render(new MainNavigationComponent(films), mainElement);

render(new SortComponent(), mainElement);

renderAllFilms(films);

const footerElement = bodyElement.querySelector(`.footer`);
const filmsStatisticsElement = footerElement.querySelector(`.footer__statistics`);

render(new FilmsStatisticsComponent(films.length), filmsStatisticsElement);
