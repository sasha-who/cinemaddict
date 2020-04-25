import {MOCK_FILMS_COUNT, INITIAL_FILMS_COUNT, ADDITIONAL_FILMS_COUNT} from "./const.js";
import {generate} from "./utils.js";
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

const render = (template, container, position = `beforeend`) => {
  container.insertAdjacentHTML(position, template);
};

const headerElement = document.querySelector(`.header`);

render(createProfileTemplate(films), headerElement);

const mainElement = document.querySelector(`.main`);

render(createMainNavigationTemplate(films), mainElement);
render(createSortTemplate(), mainElement);
render(createFilmsTemplate(), mainElement);

const filmsElement = mainElement.querySelector(`.films`);
const filmsListElement = filmsElement.querySelector(`.films-list`);
const filmsContainerElement = filmsListElement.querySelector(`.films-list__container`);

for (let i = 0; i < INITIAL_FILMS_COUNT; i++) {
  render(createFilmCardTemplate(films[i]), filmsContainerElement);
}

render(createShowMoreButtonTemplate(), filmsListElement);

const showMoreButtonElement = filmsListElement.querySelector(`.films-list__show-more`);

let currentFilmsCount = INITIAL_FILMS_COUNT;

showMoreButtonElement.addEventListener(`click`, () => {
  const addedFilmsCount = currentFilmsCount + ADDITIONAL_FILMS_COUNT;

  films.slice(currentFilmsCount, addedFilmsCount).forEach((item) => {
    render(createFilmCardTemplate(item), filmsContainerElement);
  });

  currentFilmsCount = addedFilmsCount;

  if (currentFilmsCount >= films.length) {
    showMoreButtonElement.remove();
  }
});

render(createTopRatedTemplate(films), filmsElement);
render(createMostCommentedTemplate(films), filmsElement);

const footerElement = document.querySelector(`.footer`);
const filmsStatisticsElement = footerElement.querySelector(`.footer__statistics`);

render(createFilmsStatisticsTemplate(films.length), filmsStatisticsElement);
render(createFilmDetailsTemplate(films[0]), footerElement, `afterend`);
