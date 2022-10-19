import { CommentList } from './CommentList.js';
import { UserList } from './userList.js';

/* 
TO DO 
- ADD USER LIST OBJECT ---> done
- ADD OPTION TO CHANGE ---> in progress
- LIST OF USERS IN MODAL --> done
- ADD TOP PANEL ---> done
- ADJUST STYLE
*/

fetch('../data/data.json')
  .then((res) => res.json())
  .then((data) => {
    if (!localStorage.getItem('currUser'))
      localStorage.setItem('currUser', JSON.stringify(data.currentUser));

    if (!localStorage.getItem('data'))
      localStorage.setItem('data', JSON.stringify(data.comments));

    setCurrentUser(JSON.parse(localStorage.getItem('currUser')));

    new CommentList(JSON.parse(localStorage.getItem('data')));
    new UserList(JSON.parse(localStorage.getItem('data')));
  });

function setCurrentUser(data) {
  document
    .querySelector('.logged-user-img')
    .setAttribute('src', data.image.png);
}
