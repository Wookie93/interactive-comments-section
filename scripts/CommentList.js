import { Comment } from './comment.js';

/*
TO DO:
  - add wrap with form for reply
  - add checking logged user 
  - add diffrent btns in order to login status
*/

export class CommentList {
  constructor(data, currentUser) {
    this.data = data;
    this.currentUser = currentUser;
    this.comments = [];
    this.wrap = document.querySelector('.comments .comments__inner');
    this.sendBtn = document.querySelector('.btn__submit');
    this.textarea = document.querySelector('.comments__add .textarea');
    this.init();
  }

  init = () => {
    if (!localStorage.getItem('data'))
      localStorage.setItem('data', JSON.stringify(this.data));

    this.comments = JSON.parse(localStorage.getItem('data'));
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

  createReplyForm = () => {
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

    replyFormImg.setAttribute('src', this.currentUser.image.png);
    replyFormButton.innerText = 'Reply';

    replyForm.appendChild(replyFormButton);
    replyForm.appendChild(replyFormImg);
    replyForm.appendChild(replyFormTextArea);
    replyFormWrap.appendChild(replyForm);

    return replyFormWrap;
  };

  renderList = (arr = this.comments) => {
    arr.forEach((com) => {
      this.wrap.appendChild(
        new Comment(com, this.checkUser(com.user.username)).renderComment()
      );
      if (com.replies.length) this.renderReplies(com.replies, com.id);
    });
  };

  renderReplies = (arr, parentID) => {
    const parentNode = document.getElementById(parentID);
    const replyWrap = document.createElement('div');
    const innerReplyWrap = document.createElement('div');

    replyWrap.setAttribute('data-id', parentID);
    replyWrap.setAttribute('class', 'comments__replay-wrap');
    innerReplyWrap.setAttribute('class', 'comments__replay-wrap-inner');

    arr.forEach((reply) =>
      innerReplyWrap.appendChild(
        new Comment(reply, this.checkUser(reply.user.username)).renderComment()
      )
    );

    replyWrap.appendChild(innerReplyWrap);
    parentNode.appendChild(replyWrap);
  };

  updateList = (com, parent) => {
    parent.appendChild(
      new Comment(com, this.checkUser(com.user.username)).renderComment()
    );
    localStorage.setItem('data', JSON.stringify(this.comments));
  };

  addComment = (e, parent, isReply) => {
    e.preventDefault();
    /// nowy komentarz nie odpala się bo nie ma wrapa
    /// Trzeba przepisać dodawanie odpowiedzi

    const textValue = isReply
      ? parent.querySelector('.comments__form-wrap .textarea').value
      : this.textarea.value;

    if (textValue === '') return;

    const newComment = {
      id: new Date().getTime(),
      content: textValue,
      createdAt: new Date().getTime(),
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

    this.updateList(newComment, parent);
  };

  manageActions = (e) => {
    if (e.target.closest('button') === null) return;

    const actualList = JSON.parse(localStorage.getItem('data'));
    const elID = e.target.parentNode.parentNode.parentNode.parentNode.id;

    if (elID === null) return;

    if (e.target.closest('button').classList.contains('delete')) {
      this.deleteComment(actualList, elID);
    }
    if (e.target.closest('button').classList.contains('reply')) {
      this.replyToComment(e, elID);
    }
    if (e.target.closest('button').classList.contains('edit')) {
      this.editComment(actualList, elID);
    }
  };

  deleteComment = (list, elID) => {
    console.log(elID);
    const element = document.getElementById(`${elID}`);
    if (element.parentNode.classList.contains('comments__replay-wrap-inner')) {
      const wrapID = parseInt(
        element.parentNode.parentNode.getAttribute('data-id')
      );
      const index = list.findIndex((el) => el.id === wrapID);
      list[index].replies = list[index].replies.filter(
        (el) => el.id !== parseInt(elID)
      );
      /// check if wrap is empty and remove it
      if (list[index].length === 0)
        document.querySelector(`[data-id="${wrapID}"]`).remove();
    } else {
      list = list.filter((el) => el.id !== parseInt(elID));
    }

    element.remove();
    localStorage.setItem('data', JSON.stringify(list));
  };

  replyToComment = (e, elID) => {
    const previousWrap = document.querySelector('.comments__form-wrap');
    if (previousWrap) previousWrap.remove();

    const replyWrap =
      document.querySelector(
        `[data-id="${elID}"] .comments__replay-wrap-inner`
      ) || document.getElementById(`${elID}`).parentNode;

    const replyForm = this.createReplyForm();
    replyWrap.appendChild(replyForm);

    const replyBtn = document.querySelector('.btn-reply');
    replyBtn.addEventListener('click', (e) =>
      this.addComment(e, replyWrap, true)
    );
  };

  editComment = (list, elID) => {
    list.forEach((el) => {
      if (el.id === parseInt(elID)) console.log(el);
    });
  };
}
