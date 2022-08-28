import { Comment } from './comment.js';

export class CommentList {
  constructor(data) {
    this.wrap = document.querySelector('.comments .comments__inner');
    this.data = data;
    this.comments = [];
    this.init();
  }

  init = () => {
    this.pushComments();
  };

  pushComments = () => {
    this.data.forEach((comment) => {
      this.comments.push(new Comment(comment));
    });

    console.log(this.comments);
  };

  renderList = () => {
    this.comments.map((comment) => {
      this.wrap.innerHTML += comment.setContent();
    });
  };

  pushReplies = () => {};

  sortList = () => {};
}
