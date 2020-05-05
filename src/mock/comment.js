import moment from "moment";
import {MIN_ID_VALUE, MAX_ID_VALUE} from "../const.js";
import {getRandomArrayItem, getRandomIntegerNumber} from "../utils.js";
import {getRandomDate, randomTextElements, EMOTIONS, NAMES} from "./temporary-data.js";

export const generateComment = () => {
  const date = getRandomDate();

  return {
    id: getRandomIntegerNumber(MIN_ID_VALUE, MAX_ID_VALUE),
    content: getRandomArrayItem(randomTextElements),
    emotion: getRandomArrayItem(EMOTIONS),
    author: getRandomArrayItem(NAMES),
    date: moment(date).format(`YYYY/MM/DD HH:mm`)
  };
};
