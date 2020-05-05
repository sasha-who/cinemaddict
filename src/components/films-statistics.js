import AbstractComponent from "./abstract-component";

export default class FilmsStatistics extends AbstractComponent {
  constructor(filmsModel) {
    super();

    this._filmsModel = filmsModel;
  }

  getTemplate() {
    const filmsCount = this._filmsModel.getFilms().length;

    return `<p>${filmsCount} movies inside</p>`;
  }
}
