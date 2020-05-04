import moment from "moment";
import {getRandomArrayItem} from "../utils.js";
import {getRandomDate, randomTextElements, EMOTIONS, NAMES} from "./temporary-data.js";

export const generateComment = () => {
  const date = getRandomDate();

  return {
    content: getRandomArrayItem(randomTextElements),
    emotion: getRandomArrayItem(EMOTIONS),
    author: getRandomArrayItem(NAMES),
    date: moment(date).format(`YYYY/MM/DD HH:mm`)
  };
};
