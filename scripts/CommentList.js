import { Comment } from './comment.js';

export class CommentList {
  constructor(data) {
    this.wrap = document.querySelector('.comments .comments__inner');
    this.sendBtn = document.querySelector('.btn__submit');
    this.textarea = document.querySelector('.comments__add .textarea');
    this.data = data;
    this.comments = [];
    this.toUpdate = false;
    this.replyWrap = document.createElement('div');
    this.innerReplyWrap = document.createElement('div');
    this.init();
  }

  init = () => {
    if (!localStorage.getItem('data'))
      localStorage.setItem('data', JSON.stringify(this.data));

    this.replyWrap.setAttribute('class', 'comments__replay-wrap');
    this.innerReplyWrap.setAttribute('class', 'comments__replay-wrap-inner');

    this.comments = JSON.parse(localStorage.getItem('data'));
    this.renderList();
    this.wrap.addEventListener('click', this.manageActions);
    this.sendBtn.addEventListener('click', this.addComment);
  };

  renderList = (arr = this.comments) => {
    console.log(this.data);
    arr.forEach((com) => {
      this.wrap.appendChild(new Comment(com).renderComment());
      if (com.replies.length) {
        this.replyWrap.appendChild(this.innerReplyWrap);
        this.wrap.appendChild(this.replyWrap);
      }
    });
  };

  updateList = (com) => {
    this.wrap.appendChild(new Comment(com).renderComment());
  };

  addComment = (e) => {
    e.preventDefault();
    if (this.textarea.value === '') return;

    //warunek nowy czy reply

    const newComment = {
      id: new Date().getTime(),
      content: this.textarea.value,
      createdAt: new Date().getTime(),
      score: 0,
      user: {
        image: {
          png: './images/avatars/image-ramsesmiron.png',
          webp: './images/avatars/image-ramsesmiron.webp',
        },
        username: 'ramsesmiron',
      },
      replies: [],
    };
    this.comments.push(newComment);
    this.updateList(newComment);
    this.textarea.value = '';
    localStorage.setItem('data', JSON.stringify(this.comments));
  };

  manageActions = (e) => {
    if (e.target.closest('button') === null) return;

    const actualList = JSON.parse(localStorage.getItem('data'));
    const elID = e.target.parentNode.parentNode.parentNode.id;

    if (e.target.closest('button').classList.contains('delete')) {
      this.deleteComment(actualList, elID);
    }
    if (e.target.closest('button').classList.contains('reply')) {
      this.reply(e.target.parentNode.parentNode.parentNode.parentNode, elID);
    }
    if (e.target.closest('button').classList.contains('edit')) {
      this.editComment(actualList, elID);
    }
  };

  deleteComment = (list, elID) => {
    list.forEach((el) => {
      if (el.id === parseInt(elID)) {
        list.splice(list.indexOf(el), 1);
        document.getElementById(`${elID}`).remove();
      }
    });
    localStorage.setItem('data', JSON.stringify(list));
  };

  // reply = (target, id) => {
  //   innerReplyWrap.innerHTML = `
  //     <div class="comments__add-wrap reply-wrap" data-id="${id}">
  //     <form action="" class="comments__add reply">
  //       <textarea class="textarea reply-textarea" type="text" placeholder="Add a comment..."></textarea>
  //       <img class="logged-user-img" src="./images/avatars/image-amyrobson.png" width="44" height="44" alt="">
  //       <button class="btn btn__reply" type="submit">reply</button>
  //     </form>
  //     </div>
  //   `;
  //   replyWrap.appendChild(innerReplyWrap);
  //   target.appendChild(replyWrap);

  //   document
  //     .querySelector(`.reply-wrap[data-id="${id}"] .btn__reply`)
  //     .addEventListener('click', (e) => this.addReply(e, id));
  // };

  // addReply = (e, elID) => {
  //   const replyTextArea = document.querySelector(
  //     `.reply-wrap[data-id="${elID}"] .reply-textarea`
  //   );
  //   this.addComment(e);
  // };

  editComment = (list, elID) => {
    list.forEach((el) => {
      if (el.id === parseInt(elID)) console.log(el);
    });
  };
}
