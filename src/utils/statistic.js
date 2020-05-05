import {FLAGS} from "../const.js";

const statistic = {};

export const getFilmsStatistic = (films) => {
  FLAGS.forEach((flag) => {
    statistic[flag] = 0;

    films.forEach((film) => {
      if (film[flag]) {
        statistic[flag]++;
      }
    });
  });

  return statistic;
};
