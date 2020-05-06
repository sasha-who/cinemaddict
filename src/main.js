import {MOCK_FILMS_COUNT} from "./const.js";
import {generate} from "./utils/common.js";
import {render} from "./utils/render.js";
import {generateFilm} from "./mock/film.js";
import ProfileComponent from "./components/profile.js";
import MainNavigationComponent from "./components/main-navigation.js";
import FilmsStatisticsComponent from "./components/films-statistics.js";
import FilmsController from "./controllers/films.js";
import FilterController from "./controllers/filter.js";
import FilmsModel from "./models/films.js";

const films = generate(MOCK_FILMS_COUNT, generateFilm);

const bodyElement = document.querySelector(`body`);
const headerElement = bodyElement.querySelector(`.header`);

const filmsModel = new FilmsModel();
filmsModel.setFilms(films);

render(new ProfileComponent(filmsModel), headerElement);

const mainElement = bodyElement.querySelector(`.main`);

const mainNavigationComponent = new MainNavigationComponent();
render(mainNavigationComponent, mainElement);

const filterController = new FilterController(mainNavigationComponent.getElement(), filmsModel);
filterController.render();

const filmsController = new FilmsController(mainElement, filmsModel);
filmsController.render();

const footerElement = bodyElement.querySelector(`.footer`);
const filmsStatisticsElement = footerElement.querySelector(`.footer__statistics`);

render(new FilmsStatisticsComponent(filmsModel), filmsStatisticsElement);
