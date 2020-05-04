import {MOCK_FILMS_COUNT} from "./const.js";
import {generate} from "./utils.js";
import {render} from "./render.js";
import {generateFilm} from "./mock/film.js";
import ProfileComponent from "./components/profile.js";
import MainNavigationComponent from "./components/main-navigation.js";
import FilmsStatisticsComponent from "./components/films-statistics.js";
import FilmsController from "./controllers/films.js";

const films = generate(MOCK_FILMS_COUNT, generateFilm);

const bodyElement = document.querySelector(`body`);
const headerElement = bodyElement.querySelector(`.header`);

render(new ProfileComponent(films), headerElement);

const mainElement = bodyElement.querySelector(`.main`);

render(new MainNavigationComponent(films), mainElement);

const filmsController = new FilmsController(mainElement);
filmsController.render(films);

const footerElement = bodyElement.querySelector(`.footer`);
const filmsStatisticsElement = footerElement.querySelector(`.footer__statistics`);

render(new FilmsStatisticsComponent(films.length), filmsStatisticsElement);

import moment from "moment";

// Продолжительность фильма
const date5 = moment.duration(1229, `minutes`);
const date6 = `${date5.hours()}h ${date5.minutes()}m`;

// Дата релиза фильма
const date2 = new Date();
const date3 = moment(date2).format(`DD MMMM YYYY`);

// Дата комментария
const date4 = moment(date2).format(`YYYY/MM/DD HH:mm`);
