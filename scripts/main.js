import { CommentList } from './CommentList.js';
import { UserList } from './userList.js';


fetch('data/data.json')
  .then((res) => res.json())
  .then((data) => {
    if (!localStorage.getItem('currUser'))
      localStorage.setItem('currUser', JSON.stringify(data.currentUser));

    if (!localStorage.getItem('data'))
      localStorage.setItem('data', JSON.stringify(data.comments));

    new CommentList(JSON.parse(localStorage.getItem('data')));
    new UserList(JSON.parse(localStorage.getItem('data')));
  })
  .catch((err) => console.log(err));
