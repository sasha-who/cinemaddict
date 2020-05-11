import {getElementNameByHref} from "../utils/common.js";
import AbstractComponent from "./abstract-component.js";

const createFilterMarkup = (filter) => {
  const {name, value, count, checked} = filter;
  const activeClass = checked ? `main-navigation__item--active` : ``;

  return (
    `<a href="#${value}" class="main-navigation__item ${activeClass}">${name} <span class="main-navigation__item-count">${count}</span></a>`
  );
};

export default class Filter extends AbstractComponent {
  constructor(filters) {
    super();

    this._filters = filters;
  }

  getTemplate() {
    const filtersMarkup = this._filters.map((filter) => createFilterMarkup(filter)).join(`\n`);

    return (
      `<div class="main-navigation__items">
        ${filtersMarkup}
      </div>`
    );
  }

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      const filterValue = getElementNameByHref(evt.target.href);
      handler(filterValue);
    });
  }
}
