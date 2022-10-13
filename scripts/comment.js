export class Comment {
  constructor(data, isLogged = false, isReply = false) {
    this.data = data;
    this.isReply = isReply;
    this.isLogged = isLogged;
    this.score = data.score;
    this.elements = [];
    this.init();
  }

  init = () => {
    this.createElements();
    this.setAttributes();
  };

  createElements = () => {
    const comment = document.createElement('div');
    const commentInner = document.createElement('div');
    const commentHeader = document.createElement('div');
    const commentContent = document.createElement('div');
    const commentActions = document.createElement('div');

    this.elements.push(
      comment,
      commentInner,
      commentHeader,
      commentContent,
      commentActions
    );
  };

  setAttributes = () => {
    const [
      comment,
      commentInner,
      commentHeader,
      commentContent,
      commentActions,
    ] = this.elements;

    comment.setAttribute('class', 'comment');
    comment.setAttribute('id', this.data.id);
    commentInner.setAttribute('class', 'comment__innerwrap');
    commentHeader.setAttribute('class', 'comment__header');
    commentContent.setAttribute('class', 'comment__content');
    commentActions.setAttribute('class', 'comment__actions');

    if (this.isReply) comment.setAttribute('data-role', 'reply');

    commentHeader.innerHTML = `
    <div class="user">
      <img src="${
        this.data.user.image.png
      }" class="user-img" width="32" height="32" alt="user-image">
      <p class="user-name">${this.data.user.username}</p>
      ${this.isLogged ? `<p class="user-logged-flag">you</p>` : ''}
    </div>
    <p class="date">${this.data.createdAt}</p>
    `;
    commentContent.innerHTML = `<p>${this.data.content}</p>`;

    commentActions.innerHTML = `
      <div class="score-wrap">
        <div class="upvote"></div>
        <div class="score">${this.score}</div>
        <div class="downvote"></div>
      </div>
      <div class="btn-wrap">
      ${
        this.isLogged
          ? `<button class="action delete">Delete</button>
      <button class="action edit">Edit</button>`
          : `<button class="action reply">Reply</button>`
      }
      </div>
      `;
  };

  renderComment = () => {
    const [
      comment,
      commentInner,
      commentHeader,
      commentContent,
      commentActions,
    ] = this.elements;

    commentInner.appendChild(commentHeader);
    commentInner.appendChild(commentContent);
    commentInner.appendChild(commentActions);
    comment.appendChild(commentInner);

    this.addEvent(commentActions);
    return comment;
  };

  addEvent = (commentActions) => {
    commentActions.addEventListener('click', this.checkBtn);
  };

  checkBtn = (e) => {
    if (e.target.classList.contains('downvote')) this.updateScore('down');
    if (e.target.classList.contains('upvote')) this.updateScore('up');
  };

  updateScore = (val) => {
    val === 'down' ? this.score-- : this.score++;

    let arr = JSON.parse(localStorage.getItem('data'));
    arr.forEach((el) => {
      if (el.id === this.data.id) el.score = this.score;
      else {
        el.replies.forEach((reply) => {
          if (reply.id === this.data.id) reply.score = this.score;
        });
      }
    });
    localStorage.setItem('data', JSON.stringify(arr));

    this.setAttributes(this);
  };
}
