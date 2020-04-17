import {FILMS_COUNT, EXTRA_FILM_COUNT} from "./const.js";
import {generateFilms} from "./mock/films.js";
import {createProfileTemplate} from "./components/profile.js";
import {createMainNavigationTemplate} from "./components/main-navigation.js";
import {createSortTemplate} from "./components/sort.js";
import {createFilmsTemplate} from "./components/films.js";
import {createFilmCardTemplate} from "./components/film-card.js";
import {createShowMoreButtonTemplate} from "./components/show-more-button.js";
import {createTopRatedTemplate} from "./components/top-rated.js";
import {createMostCommentedTemplate} from "./components/most-commented.js";
import {createFilmsStatisticsTemplate} from "./components/films-statistics.js";
import {createFilmDetailsTemplate} from "./components/film-details.js";

const MOCK_FILMS_COUNT = 20;

const films = generateFilms(MOCK_FILMS_COUNT);

const render = (template, container, position = `beforeend`) => {
  container.insertAdjacentHTML(position, template);
};

const headerElement = document.querySelector(`.header`);

render(createProfileTemplate(), headerElement);

const mainElement = document.querySelector(`.main`);

render(createMainNavigationTemplate(), mainElement);
render(createSortTemplate(), mainElement);
render(createFilmsTemplate(), mainElement);

const filmsElement = mainElement.querySelector(`.films`);
const filmsListElement = filmsElement.querySelector(`.films-list`);
const filmsContainerElement = filmsListElement.querySelector(`.films-list__container`);

for (let i = 0; i < FILMS_COUNT; i++) {
  render(createFilmCardTemplate(), filmsContainerElement);
}

render(createShowMoreButtonTemplate(), filmsListElement);
render(createTopRatedTemplate(), filmsElement);
render(createMostCommentedTemplate(), filmsElement);

const extraFilmsListElements = filmsElement.querySelectorAll(`.films-list--extra .films-list__container`);

extraFilmsListElements.forEach((item) => {
  for (let i = 0; i < EXTRA_FILM_COUNT; i++) {
    render(createFilmCardTemplate(), item);
  }
});

const footerElement = document.querySelector(`.footer`);
const filmsStatisticsElement = footerElement.querySelector(`.footer__statistics`);

render(createFilmsStatisticsTemplate(), filmsStatisticsElement);
// render(createFilmDetailsTemplate(), footerElement, `afterend`);

import "./mock/films.js";
