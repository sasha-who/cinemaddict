export default class Comment {
  constructor(data) {
    this.id = data[`id`];
    this.comment = data[`comment`];
    this.emotion = data[`emotion`];
    this.author = data[`author`];
    this.date = data[`date`];
  }

  toRAW() {
    return {
      "comment": this.comment,
      "date": new Date(),
      "emotion": this.emotion
    };
  }

  static parseComment(data) {
    return new Comment(data);
  }

  static parseComments(data) {
    return data.map(Comment.parseComment);
  }

  static clone(data) {
    return new Comment(data.toRAW());
  }
}
