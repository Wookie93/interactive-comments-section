import { Comment } from './comment.js';

export class CommentList {
  constructor(data) {
    this.wrap = document.querySelector('.comments .comments__inner');
    this.sendBtn = document.querySelector('.btn__submit');
    this.textarea = document.querySelector('.comments__add .textarea');
    this.data = data;
    this.comments = [];
    this.init();
  }

  init = () => {
    this.pushComments();
    this.sendBtn.addEventListener('click', this.addComment);
  };

  pushComments = () => {
    this.data.forEach((comment) => {
      this.comments.push(new Comment(comment));
    });
  };

  addComment = (e) => {
    e.preventDefault();
    let newComment = {
      id: new Date().getTime(),
      content: this.textarea.value,
      createdAt: new Date().getTime(),
      score: 0,
      user: {
        image: {
          png: './images/avatars/image-amyrobson.png',
          webp: './images/avatars/image-amyrobson.webp',
        },
        username: 'amyrobson',
      },
    };
    this.comments.push(new Comment(newComment));
    this.renderList([new Comment(newComment)]);
  };

  renderList = (arr = this.comments) => {
    arr.map((comment) => {
      this.wrap.innerHTML += comment.setContent();
    });
  };

  sortList = () => {};
}
