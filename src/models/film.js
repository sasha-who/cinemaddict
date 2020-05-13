export default class Film {
  constructor(data) {
    this.id = data[`id`];
    this.name = data[`film_info`][`title`];
    this.poster = data[`film_info`][`poster`];
    this.date = data[`film_info`][`release`][`date`] ?
      new Date(data[`film_info`][`release`][`date`]) :
      null;
    this.duration = data[`film_info`][`runtime`];
    this.comments = data[`comments`];
    this.commentsCount = this.comments.length;
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

  toRAW() {
    return {
      "id": this.id,
      "comments": this.comments,
      "film_info": {
        "title": this.name,
        "alternative_title": this.originalName,
        "total_rating": this.rating,
        "poster": this.poster,
        "age_rating": this.ageLimit,
        "director": this.director,
        "writers": this.screenwriters,
        "actors": this.actors,
        "release": {
          "date": this.date ? this.date.toISOString() : null,
          "release_country": this.country
        },
        "runtime": this.duration,
        "genre": this.genres,
        "description": this.description
      },
      "user_details": {
        "watchlist": this.isInWatchlist,
        "already_watched": this.isWatched,
        "watching_date": null,
        "favorite": this.isInFavorites
      }
    };
  }

  static parseFilm(data) {
    return new Film(data);
  }

  static parseFilms(data) {
    return data.map(Film.parseFilm);
  }

  static clone(data) {
    return new Film(data.toRAW());
  }
}
