import moment from "moment";
import {COMMENT_DATE_FORMAT} from "../const.js";

export default class Comment {
  constructor(data) {
    this.id = data[`id`];
    this.content = data[`comment`];
    this.emotion = data[`emotion`];
    this.author = data[`author`];
    this.date = moment(new Date(data[`date`])).format(COMMENT_DATE_FORMAT);
  }

  static parseComment(data) {
    return new Comment(data);
  }

  static parseComments(data) {
    return data.map(Comment.parseComment);
  }
}
