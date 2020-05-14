import AbstractComponent from "./abstract-component";

export default class CommentsError extends AbstractComponent {
  getTemplate() {
    return (
      `<p class="film-details__comments-error">Error loading comments</p>`
    );
  }
}
