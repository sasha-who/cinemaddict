import {SortType} from "../const.js";
import AbstractComponent from "./abstract-component";

export default class Sort extends AbstractComponent {
  constructor() {
    super();

    this._currentSortType = SortType.DEFAULT;
    this._sortingElements = this.getElement().querySelectorAll(`.sort__button`);
  }

  getSortType() {
    return this._currentSortType;
  }

  resetSortType() {
    const [defaultSortElement] = this._sortingElements;

    this._toggleActiveClass(defaultSortElement);
    this._currentSortType = SortType.DEFAULT;
  }

  getTemplate() {
    return (
      `<ul class="sort">
        <li><a href="#"
            class="sort__button sort__button--active"
            data-sort-type="default">Sort by default</a></li>
        <li><a href="#" class="sort__button" data-sort-type="date">Sort by date</a></li>
        <li><a href="#" class="sort__button" data-sort-type="rating">Sort by rating</a></li>
      </ul>`
    );
  }

  setSortTypeChangeHandler(handler) {
    for (const element of this._sortingElements) {
      element.addEventListener(`click`, (evt) => {
        evt.preventDefault();

        const sortType = element.dataset.sortType;

        if (sortType === this._currentSortType) {
          return;
        }

        this._toggleActiveClass(element);
        this._currentSortType = sortType;
        handler(this._currentSortType);
      });
    }
  }

  _toggleActiveClass(element) {
    const activeButtonElement = this.getElement().querySelector(`.sort__button--active`);

    activeButtonElement.classList.remove(`sort__button--active`);
    element.classList.add(`sort__button--active`);
  }
}
