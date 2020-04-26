import {
  MOCK_FILMS_COUNT,
  INITIAL_FILMS_COUNT,
  ADDITIONAL_FILMS_COUNT
} from "./const.js";
import {generate, render, getSortedFilms} from "./utils.js";
import {generateFilm} from "./mock/film.js";
import ProfileComponent from "./components/profile.js";
import MainNavigationComponent from "./components/main-navigation.js";
import SortComponent from "./components/sort.js";
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

  const cardClickHandler = () => {
    bodyElement.appendChild(filmDetailedCardComponent.getElement());
  };

  const closeClickHandler = () => {
    bodyElement.removeChild(filmDetailedCardComponent.getElement());
  };

  const posterElement = filmCardComponent.getElement().querySelector(`.film-card__poster`);
  const titleElement = filmCardComponent.getElement().querySelector(`.film-card__title`);
  const commentsElement = filmCardComponent.getElement().querySelector(`.film-card__comments`);
  const closeButton = filmDetailedCardComponent.getElement()
    .querySelector(`.film-details__close-btn`);

  posterElement.addEventListener(`click`, cardClickHandler);
  titleElement.addEventListener(`click`, cardClickHandler);
  commentsElement.addEventListener(`click`, cardClickHandler);
  closeButton.addEventListener(`click`, closeClickHandler);

  render(filmCardComponent.getElement(), container);
};

const films = generate(MOCK_FILMS_COUNT, generateFilm);

const bodyElement = document.querySelector(`body`);
const headerElement = bodyElement.querySelector(`.header`);

const profileComponent = new ProfileComponent(films);
render(profileComponent.getElement(), headerElement);

const mainElement = bodyElement.querySelector(`.main`);

const mainNavigationComponent = new MainNavigationComponent(films);
render(mainNavigationComponent.getElement(), mainElement);

const sortComponent = new SortComponent();
render(sortComponent.getElement(), mainElement);

const filmsComponent = new FilmsComponent();
render(filmsComponent.getElement(), mainElement);

const filmsElement = filmsComponent.getElement();
const filmsListElement = filmsElement.querySelector(`.films-list`);
const filmsContainerElement = filmsListElement.querySelector(`.films-list__container`);

for (let i = 0; i < INITIAL_FILMS_COUNT; i++) {
  renderCard(films[i], filmsContainerElement);
}

const showMoreButtonComponent = new ShowMoreButtonComponent();
render(showMoreButtonComponent.getElement(), filmsListElement);

let currentFilmsCount = INITIAL_FILMS_COUNT;

showMoreButtonComponent.getElement().addEventListener(`click`, () => {
  const addedFilmsCount = currentFilmsCount + ADDITIONAL_FILMS_COUNT;

  films.slice(currentFilmsCount, addedFilmsCount).forEach((item) => {
    renderCard(item, filmsContainerElement);
  });

  currentFilmsCount = addedFilmsCount;

  if (currentFilmsCount >= films.length) {
    showMoreButtonComponent.getElement().remove();
  }
});

const topRatedComponent = new TopRatedComponent(films);
render(topRatedComponent.getElement(), filmsElement);

const topRatedFilmsContainer = topRatedComponent.getElement()
  .querySelector(`.films-list__container`);

const topRatedFilms = getSortedFilms(films, `rating`);

for (const film of topRatedFilms) {
  renderCard(film, topRatedFilmsContainer);
}

const mostCommentedComponent = new MostCommentedComponent(films);
render(mostCommentedComponent.getElement(), filmsElement);

const mostCommentedFilmsContainer = mostCommentedComponent.getElement()
  .querySelector(`.films-list__container`);

const mostCommentedFilms = getSortedFilms(films, `commentsCount`);

for (const film of mostCommentedFilms) {
  renderCard(film, mostCommentedFilmsContainer);
}

const footerElement = bodyElement.querySelector(`.footer`);
const filmsStatisticsElement = footerElement.querySelector(`.footer__statistics`);

const filmsStatisticsComponent = new FilmsStatisticsComponent(films.length);
render(filmsStatisticsComponent.getElement(), filmsStatisticsElement);
