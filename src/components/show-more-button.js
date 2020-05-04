import AbstractComponent from "./abstract-component";

export default class ShowMoreButton extends AbstractComponent {
  getTemplate() {
    return `<button class="films-list__show-more">Show more</button>`;
  }

  setClickHandler(handler) {
    this.getElement().addEventListener(`click`, handler);
  }
}

