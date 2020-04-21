import {FLAGS} from "./const.js";

const statistic = {};

FLAGS.forEach((flag) => {
  statistic[flag] = 0;
});

export const getFilmsStatistic = (films) => {
  films.forEach((film) => {
    FLAGS.forEach((flag) => {
      if (film[flag]) {
        statistic[flag]++;
      }
    });
  });

  return statistic;
};
