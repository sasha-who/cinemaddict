import {getElementNameByHref} from "../utils/common.js";
import AbstractComponent from "./abstract-component.js";

export default class MainNavigation extends AbstractComponent {
  getTemplate() {
    return (
      `<nav class="main-navigation">
        <a href="#stats" class="main-navigation__additional">Stats</a>
      </nav>`
    );
  }

  setOnViewChange(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      const currentLink = evt.target.closest(`a`);

      if (currentLink) {
        const menuItem = getElementNameByHref(currentLink.href);

        handler(menuItem);
      }
    });
  }
}
