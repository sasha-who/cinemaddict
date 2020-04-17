import {getRandomIntegerNumber} from "../utils.js";

const DATE_GAP = 20;

export const randomText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus`;

export const Names = [
  `John Smith`,
  `Chuck Taylor`,
  `Harry Wilson`,
  `Jane Brown`,
  `Lily Evans`,
  `James Miller`
];

export const Emotions = [
  `smile`,
  `sleeping`,
  `puke`,
  `angry`
];

export const FilmsNames = [
  `The Great Flamarion`,
  `Made for Each Other`,
  `The Dance of Life`,
  `Sagebrush Trail`,
  `The Man with the Golden Arm`,
  `Santa Claus Conquers the Martians`,
  `Popeye the Sailor Meets Sindbad the Sailor`
];

export const Posters = [
  `made-for-each-other.png`,
  `popeye-meets-sinbad.png`,
  `sagebrush-trail.jpg`,
  `santa-claus-conquers-the-martians.jpg`,
  `the-dance-of-life.jpg`,
  `the-great-flamarion.jpg`,
  `the-man-with-the-golden-arm.jpg`
];

export const Genres = [
  `comedy`,
  `drama`,
  `melodrama`,
  `horror`,
  `thriller`
];

export const Country = [
  `United Kingdom`,
  `Scotland`,
  `Ireland`,
  `USA`,
  `Norway`
];

export const AgeLimits = [0, 13, 18, 21];

export const getRandomDate = () => {
  const date = new Date();

  date.setDate(date.getDate() + getRandomIntegerNumber(-DATE_GAP, 0));

  return date;
};
