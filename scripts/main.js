import { CommentList } from './CommentList.js';

const btnDelete = document.querySelector('.action.delete');
const bodyMask = document.querySelector('.mask');
const modal = document.querySelector('.modal');

function deleteComment() {
  bodyMask.classList.add('active');
  modal.classList.add('active');
  document.body.classList.add('active');
}

btnDelete.addEventListener('click', deleteComment);

fetch('../data/data.json')
  .then((res) => res.json())
  .then((data) => {
    const comments = data.comments;
    setCurrentUser(data.currentUser);
    displayCommentList(comments);
  });

function setCurrentUser(data) {
  document
    .querySelector('.logged-user-img')
    .setAttribute('src', data.image.png);
}

function displayCommentList(comments) {
  return new CommentList(comments).renderList();
}
