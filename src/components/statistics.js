import {MINUTES_IN_HOUR, GENRES} from "../const.js";
import {getUserRang} from "../utils/common.js";
import {getWatchedFilms} from "../utils/filter.js";
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import AbstractSmartComponent from "../components/abstract-smart-component.js";

const getGenreCounter = (films) => {
  const counter = {};

  for (const genre of GENRES) {
    counter[genre] = 0;
  }

  for (const film of films) {
    film.genres.forEach((item) => {
      counter[item]++;
    });
  }

  return counter;
};

const Period = {
  ALL: `all-time`,
  TODAY: `today`,
  WEEK: `week`,
  MONTH: `month`,
  YEAR: `year`
};

export default class Statistic extends AbstractSmartComponent {
  constructor(filmsModel) {
    super();

    this._filmsModel = filmsModel;
    this._films = this._filmsModel.getFilms();
    this._watchedFilms = getWatchedFilms(this._films);
    this._period = Period.ALL;
    this.setPeriodChange();
  }

  getTemplate() {
    const films = this._filmsModel.getFilms();
    const watchedFilms = getWatchedFilms(films);
    const summaryTime = watchedFilms.reduce((sum, current) => sum + current.duration, 0);
    const durationHours = Math.floor(summaryTime / MINUTES_IN_HOUR);
    const durationMinutes = Math.round(summaryTime % (durationHours * MINUTES_IN_HOUR));
    const topGenre = Object.entries(getGenreCounter(watchedFilms))
      .sort((a, b) => b[1] - a[1])[0][0];

    return (
      `<section class="statistic">
        <p class="statistic__rank">
          Your rank
          <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
          <span class="statistic__rank-label">${getUserRang(films)}</span>
        </p>

        <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
          <p class="statistic__filters-description">Show stats:</p>

          <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" checked>
          <label for="statistic-all-time" class="statistic__filters-label">All time</label>

          <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today">
          <label for="statistic-today" class="statistic__filters-label">Today</label>

          <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week">
          <label for="statistic-week" class="statistic__filters-label">Week</label>

          <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month">
          <label for="statistic-month" class="statistic__filters-label">Month</label>

          <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year">
          <label for="statistic-year" class="statistic__filters-label">Year</label>
        </form>

        <ul class="statistic__text-list">
          <li class="statistic__text-item">
            <h4 class="statistic__item-title">You watched</h4>
            <p class="statistic__item-text">${watchedFilms.length} <span class="statistic__item-description">movies</span></p>
          </li>
          <li class="statistic__text-item">
            <h4 class="statistic__item-title">Total duration</h4>
            <p class="statistic__item-text">${durationHours} <span class="statistic__item-description">h</span> ${durationMinutes} <span class="statistic__item-description">m</span></p>
          </li>
          <li class="statistic__text-item">
            <h4 class="statistic__item-title">Top genre</h4>
            <p class="statistic__item-text">${topGenre}</p>
          </li>
        </ul>

        <div class="statistic__chart-wrap">
          <canvas class="statistic__chart" width="1000"></canvas>
        </div>

      </section>`
    );
  }

  _renderChart(films) {
    const BAR_HEIGHT = 50;
    const statisticCtx = document.querySelector(`.statistic__chart`);

    statisticCtx.height = BAR_HEIGHT * 5;

    return new Chart(statisticCtx, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: GENRES,
        datasets: [{
          data: Object.values(getGenreCounter(films)),
          backgroundColor: `#ffe800`,
          hoverBackgroundColor: `#ffe800`,
          anchor: `start`
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 20
            },
            color: `#ffffff`,
            anchor: `start`,
            align: `start`,
            offset: 40,
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: `#ffffff`,
              padding: 100,
              fontSize: 20
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            barThickness: 24
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
          }],
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false
        }
      }
    });
  }

  setPeriodChange() {
    this.getElement().querySelector(`.statistic__filters`)
      .addEventListener(`change`, (evt) => {
        if (evt.target.tagName !== `INPUT`) {
          return;
        }

        this._period = evt.target.value;
        this._rerender();
      });
  }

  _getFilmsByPeriod(films, period) {
    const date = new Date();

    switch (period) {
      case Period.ALL:
        return films;

      case Period.TODAY:
        return films.filter((item) => item.date >= date.setDate(date.getDate() - 1));

      case Period.WEEK:
        return films.filter((item) => item.date >= date.setDate(date.getDate() - 7));

      case Period.MONTH:
        return films.filter((item) => item.date >= date.setMonth(date.getMonth() - 1));

      case Period.YEAR:
        return films.filter((item) => item.date >= date.setFullYear(date.getFullYear() - 1));

      default:
        return films;
    }
  }

  _rerender() {
    super.rerender();

    const watchedFilms = getWatchedFilms(this._filmsModel.getFilms());

    this.getElement().querySelector(`input[value="${this._period}"]`).checked = true;
    this._renderChart(this._getFilmsByPeriod(watchedFilms, this._period));
  }

  recoveryListeners() {
    this.setPeriodChange();
  }

  show() {
    super.show();

    this._period = Period.ALL;
    this._rerender();
  }
}
