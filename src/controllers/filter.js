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

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._filmsModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const container = this._container;
    const allFilms = this._filmsModel.getAllFilms();
    const filters = Filters.map((filterType) => {
      return Object.assign(filterType, {
        count: getFilmsByFilter(allFilms, filterType.value).length,
        checked: filterType === this._activeFilterType,
      });
    });

    const oldFilterComponent = this._filterComponent;

    this._filterComponent = new FilterComponent(filters);
    this._filterComponent.setFilterChangeHandler(this._onFilterChange);

    if (oldFilterComponent) {
      replace(this._filterComponent, oldFilterComponent);
    } else {
      render(this._filterComponent, container, RenderPosition.AFTERBEGIN);
    }
  }

  _onFilterChange(filterType) {
    this._filmsModel.setFilter(filterType);
    this._activeFilterType = filterType;
  }

  _onDataChange() {
    this.render();
  }
}
