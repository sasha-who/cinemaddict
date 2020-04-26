import {
  MOCK_FILMS_COUNT,
  INITIAL_FILMS_COUNT,
  ADDITIONAL_FILMS_COUNT,
  RenderPosition
} from "./const.js";
import {generate, render} from "./utils.js";
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

const films = generate(MOCK_FILMS_COUNT, generateFilm);

const headerElement = document.querySelector(`.header`);

const profileComponent = new ProfileComponent(films);
render(profileComponent.getElement(), headerElement);

const mainElement = document.querySelector(`.main`);

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
  const filmCardComponent = new FilmCardComponent(films[i]);
  render(filmCardComponent.getElement(), filmsContainerElement);
}

const showMoreButtonComponent = new ShowMoreButtonComponent();
render(showMoreButtonComponent.getElement(), filmsListElement);

let currentFilmsCount = INITIAL_FILMS_COUNT;

showMoreButtonComponent.getElement().addEventListener(`click`, () => {
  const addedFilmsCount = currentFilmsCount + ADDITIONAL_FILMS_COUNT;

  films.slice(currentFilmsCount, addedFilmsCount).forEach((item) => {
    const filmCardComponent = new FilmCardComponent(item);
    render(filmCardComponent.getElement(), filmsContainerElement);
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

const topRatedFilms = topRatedComponent.getResultedFilms();

for (const film of topRatedFilms) {
  const filmCardComponent = new FilmCardComponent(film);
  render(filmCardComponent.getElement(), topRatedFilmsContainer);
}

const mostCommentedComponent = new MostCommentedComponent(films);
render(mostCommentedComponent.getElement(), filmsElement);

const MostCommentedFilmsContainer = mostCommentedComponent.getElement()
  .querySelector(`.films-list__container`);

const mostCommentedFilms = mostCommentedComponent.getResultedFilms();

for (const film of mostCommentedFilms) {
  const filmCardComponent = new FilmCardComponent(film);
  render(filmCardComponent.getElement(), MostCommentedFilmsContainer);
}

const footerElement = document.querySelector(`.footer`);
const filmsStatisticsElement = footerElement.querySelector(`.footer__statistics`);

const filmsStatisticsComponent = new FilmsStatisticsComponent(films.length);
render(filmsStatisticsComponent.getElement(), filmsStatisticsElement);

const filmDetailedCardComponent = new FilmDetailedCardComponent(films[0]);
render(filmDetailedCardComponent.getElement(), footerElement, RenderPosition.AFTEREND);
