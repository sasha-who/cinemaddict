import {MINUTES_IN_HOUR, BAR_HEIGHT, StatisticPeriod, StatisticFilters} from "../const.js";
import {getUserRang} from "../utils/common.js";
import {getWatchedFilms} from "../utils/filter.js";
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import AbstractSmartComponent from "../components/abstract-smart-component.js";

const createFiltersMarkup = () => {
  return StatisticFilters.map((filter) => {
    const {name, value, isChecked} = filter;
    const checkedAttribute = isChecked ? `checked` : ``;

    return (
      `<input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter"
       id="statistic-${value}" value="${value}" ${checkedAttribute}>
      <label for="statistic-${value}" class="statistic__filters-label">${name}</label>`
    );
  })
    .join(`\n`);
};

const getGenres = (films) => {
  let genres = [];

  for (const film of films) {
    genres = genres.concat(film.genres);
  }

  return Array.from(new Set(genres));
};

const getGenreCounter = (films, genres) => {
  const counter = {};

  for (const genre of genres) {
    counter[genre] = 0;
  }

  for (const film of films) {
    film.genres.forEach((item) => {
      counter[item]++;
    });
  }

  return counter;
};

const getFilmsByPeriod = (films, period) => {
  const date = new Date();

  const getFilteredFilms = (limitDate) => {
    return films.filter((item) => item.watchingDate && item.watchingDate.getTime() >= limitDate);
  };

  switch (period) {
    case StatisticPeriod.ALL:
      return films;

    case StatisticPeriod.TODAY:
      return getFilteredFilms(date.setHours(0, 0, 0, 0));

    case StatisticPeriod.WEEK:
      return getFilteredFilms(date.setDate(date.getDate() - 7));

    case StatisticPeriod.MONTH:
      return getFilteredFilms(date.setMonth(date.getMonth() - 1));

    case StatisticPeriod.YEAR:
      return getFilteredFilms(date.setFullYear(date.getFullYear() - 1));

    default:
      return films;
  }
};

const renderChart = (films, genres) => {
  const statisticCtxElement = document.querySelector(`.statistic__chart`);

  statisticCtxElement.height = BAR_HEIGHT * 5;

  return new Chart(statisticCtxElement, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: genres,
      datasets: [{
        data: Object.values(getGenreCounter(films, genres)),
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
};

const getSummaryTime = (films) => {
  return films.reduce((sum, current) => sum + current.duration, 0);
};

const getTopGenre = (films, genres) => {
  return Object.entries(getGenreCounter(films, genres))
    .sort((a, b) => b[1] - a[1])[0];
};

export default class Statistic extends AbstractSmartComponent {
  constructor(filmsModel) {
    super();

    this._filmsModel = filmsModel;
    this._films = this._filmsModel.getFilms();
    this._watchedFilms = getWatchedFilms(this._filmsModel.getFilms());
    this._filmsByPeriod = getFilmsByPeriod(this._watchedFilms, StatisticPeriod.ALL);
    this._period = StatisticPeriod.ALL;
    this._genres = getGenres(this._watchedFilms);

    this.setPeriodChange();
  }

  getTemplate() {
    const summaryTime = getSummaryTime(this._filmsByPeriod);
    const durationHours = Math.floor(summaryTime / MINUTES_IN_HOUR);
    const durationMinutes = Math.round(summaryTime % (durationHours * MINUTES_IN_HOUR));
    const topGenre = getTopGenre(this._filmsByPeriod, this._genres);
    const durationHoursValue = durationHours ? durationHours : `0`;
    const durationMinutesValue = durationMinutes ? durationMinutes : `0`;
    const topGenreValue = topGenre && topGenre[1] > 0 ? topGenre[0] : ``;

    return (
      `<section class="statistic">
        <p class="statistic__rank">
          Your rank
          <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
          <span class="statistic__rank-label">${getUserRang(this._films)}</span>
        </p>

        <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
          <p class="statistic__filters-description">Show stats:</p>

          ${createFiltersMarkup()}
        </form>

        <ul class="statistic__text-list">
          <li class="statistic__text-item">
            <h4 class="statistic__item-title">You watched</h4>
            <p class="statistic__item-text">${this._filmsByPeriod.length} <span class="statistic__item-description">movies</span></p>
          </li>
          <li class="statistic__text-item">
            <h4 class="statistic__item-title">Total duration</h4>
            <p class="statistic__item-text">${durationHoursValue} <span class="statistic__item-description">h</span> ${durationMinutesValue} <span class="statistic__item-description">m</span></p>
          </li>
          <li class="statistic__text-item">
            <h4 class="statistic__item-title">Top genre</h4>
            <p class="statistic__item-text">${topGenreValue}</p>
          </li>
        </ul>

        <div class="statistic__chart-wrap">
          <canvas class="statistic__chart" width="1000"></canvas>
        </div>

      </section>`
    );
  }

  recoveryListeners() {
    this.setPeriodChange();
  }

  show() {
    super.show();

    this._period = StatisticPeriod.ALL;
    this._rerender();
    this.recoveryListeners();
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

  _rerender() {
    this._watchedFilms = getWatchedFilms(this._filmsModel.getFilms());
    this._filmsByPeriod = getFilmsByPeriod(this._watchedFilms, this._period);
    super.rerender();
    this.getElement().querySelector(`input[value="${this._period}"]`).checked = true;

    if (this._filmsByPeriod.length > 0) {
      renderChart(this._filmsByPeriod, this._genres);
    }
  }
}
