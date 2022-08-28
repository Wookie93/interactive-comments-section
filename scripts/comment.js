export class Comment {
  constructor(data) {
    this.data = data;
    this.score = data.score;
    this.replies = data.replies;
    this.btnUpvote = document.createElement('div');
    this.btnDownvote = document.createElement('div');
    this.btnDelete = document.createElement('button');
    this.btnReply = document.createElement('button');
    this.btnEdit = document.createElement('button');
    this.init();
  }

  init = () => {
    this.setAttributes();
  };

  setAttributes = () => {
    this.btnUpvote.setAttribute('class', 'upvote');
    this.btnDownvote.setAttribute('class', 'downvote');
    this.btnDelete.setAttribute('class', 'action delete');
    this.btnReply.setAttribute('class', 'action reply');
    this.btnEdit.setAttribute('class', 'action edit');
    this.btnDelete.textContent = 'Delete';
    this.btnReply.textContent = 'Reply';
  };

  setEvents = () => {};

  setContent = () => {
    return `
    <div class="comment" id="${this.data.id}">
    <div class="comment__header">
      <div class="user">
        <img src="${this.data.user.image.png}" class="user-img" width="32" height="32" alt="user-image">
        <p>${this.data.user.username}</p>
      </div>
      <p class="date">${this.data.createdAt}</p>
    </div>
    <div class="comment__content">
      <p>${this.data.content}</p>
    </div>
    <div class="comment__actions">
      <div class="score-wrap">
        ${this.btnUpvote.outerHTML}
        <div class="score">${this.score}</div>
        ${this.btnDownvote.outerHTML}
      </div>
      <div class="btn-wrap">
        ${this.btnDelete.outerHTML}
        ${this.btnReply.outerHTML}
      </div>
    </div>
    </div>
    `;
  };

  setReplies = () => {};
}
