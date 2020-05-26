import {Filters, FilterType, RenderPosition} from "../const.js";
import {replace, render} from "../utils/render.js";
import {getFilmsByFilter} from "../utils/filter.js";
import FilterComponent from "../components/filter.js";

export default class FilterController {
  constructor(container, filmsModel) {
    this._container = container;
    this._filmsModel = filmsModel;

    this._activeFilterType = FilterType.ALL;
    this._filterComponent = null;

    this._onDataChangeHandler = this._onDataChangeHandler.bind(this);
    this._onFilterChangeHandler = this._onFilterChangeHandler.bind(this);

    this._filmsModel.setDataChangeHandler(this._onDataChangeHandler);
  }

  render() {
    const container = this._container;
    const allFilms = this._filmsModel.getFilms();
    const filters = Filters.map((filterType) => {
      return Object.assign(filterType, {
        count: getFilmsByFilter(allFilms, filterType.value).length,
        checked: filterType.value === this._activeFilterType,
      });
    });

    const oldFilterComponent = this._filterComponent;

    this._filterComponent = new FilterComponent(filters);
    this._filterComponent.setFilterChangeHandler(this._onFilterChangeHandler);

    if (oldFilterComponent) {
      replace(this._filterComponent, oldFilterComponent);
    } else {
      render(this._filterComponent, container, RenderPosition.AFTERBEGIN);
    }
  }

  removeDefaultView() {
    this._filterComponent.getElement().remove();
  }

  _onFilterChangeHandler(filterType) {
    this._filmsModel.setFilter(filterType);
    this._activeFilterType = filterType;
  }

  _onDataChangeHandler() {
    this.render();
  }
}
