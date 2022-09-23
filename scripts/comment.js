//// Stworzyć elementy dla całej struktury
//// Nie może być przez ``

export class Comment {
  constructor(data) {
    this.data = data;
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
    const commentInner = document.createElement('div'); /// here will be innerHTML
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
    commentInner.setAttribute('class', 'comment__innerwrap');
    commentInner.setAttribute('id', this.data.id);
    commentHeader.setAttribute('class', 'comment__header');
    commentContent.setAttribute('class', 'comment__content');
    commentActions.setAttribute('class', 'comment__actions');

    commentHeader.innerHTML = `
    <div class="user">
      <img src="${this.data.user.image.png}" class="user-img" width="32" height="32" alt="user-image">
      <p>${this.data.user.username}</p>
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
      <button class="action delete">Delete</button>
      <button class="action reply">Reply</button>
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
    if (e.target.classList.contains('delete')) return 'delete';
    if (e.target.classList.contains('reply')) return 'reply';
  };

  updateScore = (val) => {
    if (val === 'down') this.score--;
    if (val === 'up') this.score++;

    let arr = JSON.parse(localStorage.getItem('data'));
    arr.forEach((el) => {
      if (el.id === this.data.id) el.score = this.score;
    });
    localStorage.setItem('data', JSON.stringify(arr));

    this.setAttributes(this);
  };
}
