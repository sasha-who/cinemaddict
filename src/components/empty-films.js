import AbstractComponent from "./abstract-component";

export default class EmptyFilms extends AbstractComponent {
  getTemplate() {
    return (
      `<section class="films">
        <section class="films-list">
          <h2 class="films-list__title">There are no movies in our database</h2>
        </section>
      </section>`
    );
  }
}
