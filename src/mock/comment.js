import moment from "moment";
import {MIN_ID_VALUE, MAX_ID_VALUE, NAMES} from "../const.js";
import {getRandomArrayItem, getRandomIntegerNumber} from "../utils/common.js";
import {getRandomDate, randomTextElements, EMOTIONS} from "./temporary-data.js";

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
