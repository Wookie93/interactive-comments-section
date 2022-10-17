import { CommentList } from './CommentList.js';
import { UserList } from './userList.js';

/* 
TO DO 
- ADD USER LIST OBJECT ---> done
- ADD OPTION TO CHANGE AND ADD NEW USER ---> in progress
- LIST OF USERS IN MODAL --> done
- ADD TOP PANEL ---> done
- ADJUST STYLE
- CHOOSE IMAGE FROM COMPUTER
- EXAMPLE IMAGE IF NOT LOADED
*/

fetch('../data/data.json')
  .then((res) => res.json())
  .then((data) => {
    setCurrentUser(data.currentUser);

    if (!localStorage.getItem('data')) {
      new CommentList(data.comments, data.currentUser);
      new UserList(data.comments, data.currentUser);
    } else {
      const dataF = JSON.parse(localStorage.getItem('data'));
      new CommentList(dataF, data.currentUser);
      new UserList(dataF, data.currentUser);
    }
  });

function setCurrentUser(data) {
  document
    .querySelector('.logged-user-img')
    .setAttribute('src', data.image.png);
}
