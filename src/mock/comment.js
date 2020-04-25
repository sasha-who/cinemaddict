import {getRandomArrayItem, castomizeDateFormat} from "../utils.js";
import {getRandomDate, randomTextElements, EMOTIONS, NAMES} from "./temporary-data.js";

const formatCommentDate = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = castomizeDateFormat(date.getDate());

  return `${year}/${month}/${day}`;
};

const formatCommentTime = (date) => {
  const hours = castomizeDateFormat(date.getHours());
  const minutes = castomizeDateFormat(date.getMinutes());

  return `${hours}:${minutes}`;
};

export const generateComment = () => {
  const date = getRandomDate();

  return {
    content: getRandomArrayItem(randomTextElements),
    emotion: getRandomArrayItem(EMOTIONS),
    author: getRandomArrayItem(NAMES),
    date: `${formatCommentDate(date)} ${formatCommentTime(date)}`
  };
};
