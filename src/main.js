import {MOCK_FILMS_COUNT, STATISTIC_HREF} from "./const.js";
import {generate} from "./utils/common.js";
import {render} from "./utils/render.js";
import {generateFilm} from "./mock/film.js";
import ProfileComponent from "./components/profile.js";
import MainNavigationComponent from "./components/main-navigation.js";
import FilmsStatisticsComponent from "./components/films-statistics.js";
import StatisticComponent from "./components/statistics.js";
import FilmsController from "./controllers/films.js";
import FilterController from "./controllers/filter.js";
import FilmsModel from "./models/films.js";

const films = generate(MOCK_FILMS_COUNT, generateFilm);

const bodyElement = document.querySelector(`body`);
const headerElement = bodyElement.querySelector(`.header`);

const filmsModel = new FilmsModel();
filmsModel.setFilms(films);

const profileComponent = new ProfileComponent(filmsModel);
render(profileComponent, headerElement);

const mainElement = bodyElement.querySelector(`.main`);

const mainNavigationComponent = new MainNavigationComponent();
render(mainNavigationComponent, mainElement);

const statisticComponent = new StatisticComponent(filmsModel);
render(statisticComponent, mainElement);
statisticComponent.hide();

const filterController = new FilterController(mainNavigationComponent.getElement(), filmsModel);
filterController.render();

const filmsController = new FilmsController(mainElement, filmsModel);
filmsController.render();

mainNavigationComponent.setOnViewChange((menuItem) => {
  switch (menuItem) {
    case STATISTIC_HREF:
      statisticComponent.show();
      filmsController.hide();
      break;

    default:
      statisticComponent.hide();
      filmsController.show();
      break;
  }
});

const footerElement = bodyElement.querySelector(`.footer`);
const filmsStatisticsElement = footerElement.querySelector(`.footer__statistics`);

render(new FilmsStatisticsComponent(filmsModel), filmsStatisticsElement);
