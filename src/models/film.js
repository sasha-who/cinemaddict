export default class Film {
  constructor(data) {
    this.id = data[`id`];
    this.name = data[`film_info`][`title`];
    this.poster = data[`film_info`][`poster`];
    this.date = data[`film_info`][`release`][`date`] ?
      new Date(data[`film_info`][`release`][`date`]) :
      null;
    this.duration = data[`film_info`][`runtime`];
    this.commentsCount = data[`comments`].length;
    this.genres = data[`film_info`][`genre`];
    this.description = data[`film_info`][`description`];
    this.isInWatchlist = Boolean(data[`user_details`][`watchlist`]);
    this.isWatched = Boolean(data[`user_details`][`already_watched`]);
    this.isInFavorites = Boolean(data[`user_details`][`favorite`]);
    this.originalName = data[`film_info`][`alternative_title`];
    this.director = data[`film_info`][`director`];
    this.screenwriters = data[`film_info`][`writers`];
    this.rating = data[`film_info`][`total_rating`];
    this.actors = data[`film_info`][`actors`];
    this.country = data[`film_info`][`release`][`release_country`];
    this.ageLimit = data[`film_info`][`age_rating`];
  }

  static parseFilm(data) {
    return new Film(data);
  }

  static parseFilms(data) {
    return data.map(Film.parseFilm);
  }
}
