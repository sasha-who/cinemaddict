import {getRandomArrayItem, castomizeDateFormat} from "../utils.js";
import {getRandomDate, randomText, Emotions, Names} from "./temporary-data.js";

const formatCommentDate = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}/${month}/${day}`;
};

const formatCommentTime = (date) => {
  const hours = castomizeDateFormat(date.getHours());
  const minutes = castomizeDateFormat(date.getMinutes());

  return `${hours}:${minutes}`;
};

const generateComment = () => {
  const date = getRandomDate();

  return {
    content: getRandomArrayItem(randomText.split(`. `)),
    emotion: getRandomArrayItem(Emotions),
    author: getRandomArrayItem(Names),
    date: `${formatCommentDate(date)} ${formatCommentTime(date)}`
  };
};

export const generateComments = (count) => {
  const commets = [];

  for (let i = 0; i < count; i++) {
    commets.push(generateComment());
  }

  return commets;
};
