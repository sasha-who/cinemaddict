import {SortType} from "../const.js";
import AbstractComponent from "./abstract-component";

export default class Sort extends AbstractComponent {
  constructor() {
    super();

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
    const sortingElements = this.getElement().querySelectorAll(`.sort__button`);

    for (const element of sortingElements) {
      element.addEventListener(`click`, (evt) => {
        evt.preventDefault();

        const sortType = element.dataset.sortType;

        if (sortType === this._currentSortType) {
          return;
        }

        for (const item of sortingElements) {
          if (item.classList.contains(`sort__button--active`)) {
            item.classList.remove(`sort__button--active`);
          }
        }

        element.classList.add(`sort__button--active`);
        this._currentSortType = sortType;
        handler(this._currentSortType);
      });
    }
  }
}
