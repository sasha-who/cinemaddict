import AbstractComponent from "./abstract-component";

export default class FilmsStatistics extends AbstractComponent {
  constructor(count) {
    super();

    this._count = count;
  }

  getTemplate() {
    return `<p>${this._count} movies inside</p>`;
  }
}
