import { CommentList } from './CommentList.js';

//// TO DO LIST
/*
 - przerobić na localStorage
 - dodawanie komentarzy - doać zabezpieczenie przed pusty 
 - edycja swoich komentarzy 
 - usuwanie komentarzy
 - dodwanie punktów 
 - sortowanie listy przez punkty
 - dodawanie odpowiedzi
 - sortowanie odpowiedzi po dacie
 - oznaczanie użytkownika któremu odpowiadasz
 - dodanie ustawień dla zalogowanego użytkownika
*/

fetch('../data/data.json')
  .then((res) => res.json())
  .then((data) => {
    const comments = data.comments;
    setCurrentUser(data.currentUser);
    new CommentList(comments);
  });

function setCurrentUser(data) {
  document
    .querySelector('.logged-user-img')
    .setAttribute('src', data.image.png);
}
