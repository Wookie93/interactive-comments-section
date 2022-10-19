import { Comment } from './comment.js';

export class CommentList {
  constructor(data) {
    this.currentUser = JSON.parse(localStorage.getItem('currUser'));
    this.comments = data;
    this.wrap = document.querySelector('.comments .comments__inner');
    this.sendBtn = document.querySelector('.btn__submit');
    this.textarea = document.querySelector('.comments__add .textarea');
    this.init();
  }

  init = () => {
    this.renderList();
    this.addEvents();
  };

  addEvents = () => {
    this.wrap.addEventListener('click', this.manageActions);
    this.sendBtn.addEventListener('click', (e) =>
      this.addComment(e, this.wrap)
    );
  };

  checkUser = (com) => {
    if (com === this.currentUser.username) return true;
  };

  createReplyForm = (user) => {
    const replyFormWrap = document.createElement('div');
    const replyForm = document.createElement('form');
    const replyFormTextArea = document.createElement('textarea');
    const replyFormImg = document.createElement('img');
    const replyFormButton = document.createElement('button');

    replyFormWrap.classList.add('comments__form-wrap');
    replyForm.classList.add('comments__form');
    replyFormTextArea.classList.add('textarea');
    replyFormImg.classList.add('logged-user-img');
    replyFormButton.setAttribute('class', 'btn btn__submit btn-reply');

    replyFormTextArea.textContent = `@${user}`;

    replyFormImg.setAttribute('src', this.currentUser.image.png);
    replyFormButton.innerText = 'Reply';

    replyForm.appendChild(replyFormButton);
    replyForm.appendChild(replyFormImg);
    replyForm.appendChild(replyFormTextArea);
    replyFormWrap.appendChild(replyForm);

    return replyFormWrap;
  };

  createReplyWrap = (id) => {
    const replyWrap = document.createElement('div');
    const innerReplyWrap = document.createElement('div');

    replyWrap.setAttribute('data-id', id);
    replyWrap.setAttribute('class', 'comments__replay-wrap');
    innerReplyWrap.setAttribute('class', 'comments__replay-wrap-inner');

    replyWrap.appendChild(innerReplyWrap);

    return {
      replyWrap,
      innerReplyWrap,
    };
  };

  markUser = (id) => {
    return document.getElementById(`${id}`).querySelector('.user-name')
      .textContent;
  };

  renderList = (commentList = this.comments) => {
    const sortedCommentList = this.sortList(commentList);
    sortedCommentList.forEach((com) => {
      com.createdAt = this.checkTime(com.id / 1000);
      this.wrap.appendChild(
        new Comment(com, this.checkUser(com.user.username)).renderComment()
      );
      if (com.replies.length) this.renderReplies(com.replies, com.id);
    });
  };

  renderReplies = (replyList, parentID) => {
    const parentNode = document.getElementById(parentID);
    const replyWrap = this.createReplyWrap(parentID);

    replyList.forEach((reply) => {
      reply.createdAt = this.checkTime(reply.id / 1000);
      replyWrap.innerReplyWrap.appendChild(
        new Comment(
          reply,
          this.checkUser(reply.user.username),
          true
        ).renderComment()
      );
    });
    parentNode.appendChild(replyWrap.replyWrap);
  };

  sortList = (arr) => {
    return arr.sort((a, b) => b.score - a.score);
  };

  checkTime = (date) => {
    const timePeriods = [
      [31536000, 'year'],
      [2419200, 'month'],
      [604800, 'week'],
      [86400, 'day'],
      [3600, 'hour'],
      [60, 'minute'],
      [1, 'second'],
    ];

    if (!(date instanceof Date)) date = new Date(date * 1000);
    const seconds = (new Date() - date) / 1000;
    for (let [secondsPer, name] of timePeriods) {
      if (seconds >= secondsPer) {
        const amount = Math.floor(seconds / secondsPer);
        return `${amount} ${name}${amount > 1 ? 's' : ''} ago`;
      }
    }
    return 'Just now';
  };

  updateList = (com, parent, isReply) => {
    parent.appendChild(
      new Comment(
        com,
        this.checkUser(com.user.username),
        isReply
      ).renderComment()
    );
    localStorage.setItem('data', JSON.stringify(this.comments));
  };

  addComment = (e, parent, isReply) => {
    e.preventDefault();

    const textValue = isReply
      ? parent.querySelector('.comments__form-wrap .textarea').value
      : this.textarea.value;

    if (textValue === '') return;

    const newComment = {
      id: new Date().getTime(),
      content: textValue,
      createdAt: this.checkTime(),
      score: 0,
      user: this.currentUser,
    };

    if (isReply) {
      const index = this.comments.findIndex(
        (el) => el.id === parseInt(parent.parentNode.getAttribute('data-id'))
      );
      this.comments[index].replies.push(newComment);
      document.querySelector('.comments__form-wrap').remove();
    } else {
      newComment.replies = [];
      this.comments.push(newComment);
      this.textarea.value = '';
    }

    this.updateList(newComment, parent, isReply);
  };

  manageActions = (e) => {
    if (e.target === null) return;
    if (e.target.closest('button') === null) return;
    if (e.target.parentNode.parentNode === null) return;

    let elID = e.target.parentNode.parentNode.parentNode.parentNode.id;
    const element = e.target.closest('button').classList[1];

    switch (element) {
      case 'delete':
        this.openDeleteModal(elID);
        break;
      case 'reply':
        this.replyToComment(elID);
        break;
      case 'edit':
        this.editComment(elID);
        break;
      default:
        return;
    }
  };

  openDeleteModal = (elID) => {
    const modal = document.querySelector('.modal');
    const mask = document.querySelector('.mask');
    const yesBtn = document.querySelector('.btn__yes');
    const noBtn = document.querySelector('.btn__no');

    this.toggleModalVisibility(modal, mask, true);

    noBtn.addEventListener('click', () => {
      this.toggleModalVisibility(modal, mask, false);
    });

    yesBtn.addEventListener('click', () => {
      this.deleteComment(elID);
      this.toggleModalVisibility(modal, mask, false);
    });
  };

  toggleModalVisibility = (modal, mask, isOpen) => {
    isOpen ? modal.classList.add('active') : modal.classList.remove('active');
    isOpen ? mask.classList.add('active') : mask.classList.remove('active');
    isOpen
      ? document.body.classList.add('active')
      : document.body.classList.remove('active');
  };

  deleteComment = (elID) => {
    const element = document.getElementById(`${elID}`);
    if (element === null) return;

    const dataRole = element.getAttribute('data-role');

    if (dataRole === 'reply') {
      const wrapID = parseInt(
        element.parentNode.parentNode.getAttribute('data-id')
      );
      const index = this.comments.findIndex((el) => el.id === wrapID);

      this.comments[index].replies = this.comments[index].replies.filter(
        (el) => el.id !== parseInt(elID)
      );
      /// check if reply wrap is empty and remove it
      if (this.comments[index].length === 0)
        document.querySelector(`[data-id="${wrapID}"]`).remove();
    } else {
      this.comments = this.comments.filter((el) => el.id !== parseInt(elID));
    }

    element.remove();
    localStorage.setItem('data', JSON.stringify(this.comments));
  };

  replyToComment = (elID) => {
    const previousWrap = document.querySelector('.comments__form-wrap');
    if (previousWrap) previousWrap.remove();

    let replyWrap =
      document.querySelector(
        `[data-id="${elID}"] .comments__replay-wrap-inner`
      ) || document.getElementById(`${elID}`).parentNode;

    if (!replyWrap.classList.contains('comments__replay-wrap-inner')) {
      const newReplyWrap = this.createReplyWrap(elID);
      document.getElementById(`${elID}`).appendChild(newReplyWrap.replyWrap);
      replyWrap = newReplyWrap.innerReplyWrap;
    }

    const replyForm = this.createReplyForm(this.markUser(elID));
    replyWrap.appendChild(replyForm);

    const replyBtn = document.querySelector('.btn-reply');
    replyBtn.addEventListener('click', (e) =>
      this.addComment(e, replyWrap, true)
    );
  };

  editComment = (elID) => {
    const elementToEdit = document
      .getElementById(elID)
      .querySelector('.comment__content');
    const prevValue = elementToEdit.textContent;
    elementToEdit.innerHTML = `
    <textarea class="textarea textarea__edit" type="text">${prevValue}</textarea>
    <button class="btn btn__update">update</button>
    `;

    document
      .querySelector('.btn__update')
      .addEventListener('click', () =>
        this.updateEditedCommnet(elementToEdit, elID)
      );
  };

  updateEditedCommnet = (el, elID) => {
    const newValue = document.querySelector('.textarea__edit').value;
    el.innerHTML = `<p>${newValue}</p>`;

    if (document.getElementById(elID).getAttribute('data-role') === 'reply') {
      const parentElementID = parseInt(
        document
          .getElementById(elID)
          .parentNode.parentNode.getAttribute('data-id')
      );
      const parentIndex = this.comments.findIndex(
        (el) => el.id === parentElementID
      );
      const elementIndex = this.comments[parentIndex].replies.findIndex(
        (el) => el.id === parseInt(elID)
      );
      this.comments[parentIndex].replies[elementIndex].content = newValue;
    } else {
      const commentIndex = this.comments.findIndex(
        (el) => el.id === parseInt(elID)
      );
      this.comments[commentIndex].content = newValue;
    }

    localStorage.setItem('data', JSON.stringify(this.comments));
  };
}
