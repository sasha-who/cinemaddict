import API from "./api/index.js";
import Provider from "./api/provider.js";
import Store from "./api/store.js";
import {STATISTIC_HREF, AUTHORIZATION, STORE_NAME} from "./const.js";
import {render, remove, replace} from "./utils/render.js";
import ProfileComponent from "./components/profile.js";
import MainNavigationComponent from "./components/main-navigation.js";
import FilmsStatisticsComponent from "./components/films-statistics.js";
import StatisticComponent from "./components/statistics.js";
import SortComponent from "./components/sort.js";
import LoadingFilmsComponent from "./components/loading-films.js";
import EmptyFilmsComponent from "./components/empty-films.js";
import FilmsController from "./controllers/films.js";
import FilterController from "./controllers/filter.js";
import FilmsModel from "./models/films.js";

const bodyElement = document.querySelector(`body`);
const headerElement = bodyElement.querySelector(`.header`);
const mainElement = bodyElement.querySelector(`.main`);
const footerElement = bodyElement.querySelector(`.footer`);
const filmsStatisticsElement = footerElement.querySelector(`.footer__statistics`);

const api = new API(AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);
const filmsModel = new FilmsModel();

filmsModel.setFilms(0);

const defaultProfileComponent = new ProfileComponent(filmsModel);
render(defaultProfileComponent, headerElement);

const mainNavigationComponent = new MainNavigationComponent();
render(mainNavigationComponent, mainElement);

const defaultFilterController = new FilterController(mainNavigationComponent.getElement(), filmsModel);
defaultFilterController.render();

const defaultSortComponent = new SortComponent();
render(defaultSortComponent, mainElement);

const loadingFilmsComponent = new LoadingFilmsComponent();
render(loadingFilmsComponent, mainElement);

const defaultFilmsStatisticsComponent = new FilmsStatisticsComponent(filmsModel);
render(defaultFilmsStatisticsComponent, filmsStatisticsElement);

apiWithProvider.getFilms()
  .then((films) => {
    remove(defaultProfileComponent);
    remove(defaultSortComponent);
    remove(loadingFilmsComponent);
    remove(defaultFilmsStatisticsComponent);
    defaultFilterController.removeDefaultView();

    filmsModel.setFilms(films);

    const statisticComponent = new StatisticComponent(filmsModel);
    render(statisticComponent, mainElement);
    statisticComponent.hide();

    const filterController = new FilterController(mainNavigationComponent.getElement(), filmsModel);
    filterController.render();

    const sortComponent = new SortComponent();
    render(sortComponent, mainElement);

    const filmsController = new FilmsController(apiWithProvider, mainElement, filmsModel, sortComponent);
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
  })
  .catch(() => {
    const emptyFilmsComponent = new EmptyFilmsComponent();

    replace(emptyFilmsComponent, loadingFilmsComponent);
  });

// window.addEventListener(`load`, () => {
//   navigator.serviceWorker.register(`/sw.js`)
//     .then(() => {})
//     .catch(() => {});
// });

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);

  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
