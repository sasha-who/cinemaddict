import API from "./api.js";
import {STATISTIC_HREF, AUTHORIZATION} from "./const.js";
import {render} from "./utils/render.js";
import ProfileComponent from "./components/profile.js";
import MainNavigationComponent from "./components/main-navigation.js";
import FilmsStatisticsComponent from "./components/films-statistics.js";
import StatisticComponent from "./components/statistics.js";
import FilmsController from "./controllers/films.js";
import FilterController from "./controllers/filter.js";
import FilmsModel from "./models/films.js";

const bodyElement = document.querySelector(`body`);
const headerElement = bodyElement.querySelector(`.header`);
const mainElement = bodyElement.querySelector(`.main`);
const footerElement = bodyElement.querySelector(`.footer`);
const filmsStatisticsElement = footerElement.querySelector(`.footer__statistics`);

const api = new API(AUTHORIZATION);
const filmsModel = new FilmsModel();

const mainNavigationComponent = new MainNavigationComponent();
render(mainNavigationComponent, mainElement);

api.getFilms()
  .then((films) => {
    filmsModel.setFilms(films);
    render(new ProfileComponent(filmsModel), headerElement);

    const statisticComponent = new StatisticComponent(filmsModel);
    render(statisticComponent, mainElement);
    statisticComponent.hide();

    const filterController = new FilterController(mainNavigationComponent.getElement(), filmsModel);
    filterController.render();

    const filmsController = new FilmsController(mainElement, filmsModel);
    filmsController.render();

    render(new FilmsStatisticsComponent(filmsModel), filmsStatisticsElement);

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
  });
