export class UserList {
  constructor(data) {
    this.data = data;
    this.currentUser = JSON.parse(localStorage.getItem('currUser'));
    this.newUser = null;
    this.usersList = [];
    this.changeBtn = document.querySelector('.change-user');
    this.setBtn = document.querySelector('.set-user');
    this.addUserBtn = document.querySelector('.add-user');
    this.closeBtn = document.querySelector('.modal__close');
    this.modal = document.querySelector('.modal.user-action');
    this.title = document.querySelector('.modal.user-action .modal__title');
    this.content = document.querySelector('.modal.user-action .modal__content');
    this.mask = document.querySelector('.mask');
    this.init();
  }

  init = () => {
    this.addEvents();
  };

  addEvents = () => {
    this.changeBtn.addEventListener('click', this.getUsersList);
    this.closeBtn.addEventListener('click', this.closeModal);
  };

  toggleModalVisibility = (modal, mask, isOpen) => {
    isOpen ? modal.classList.add('active') : modal.classList.remove('active');
    isOpen ? mask.classList.add('active') : mask.classList.remove('active');
    isOpen
      ? document.body.classList.add('active')
      : document.body.classList.remove('active');
  };

  renderUserList = (arr) => {
    this.title.innerHTML = `
    <h3>Change user</h3>
    <div class='logged-as'>
    <p>Logged as: ${this.currentUser.username}</p>
    <img src='${this.currentUser.image.png}'>
    </div>
    `;
    this.content.innerHTML = arr
      .map((el, index) => {
        return `
        <div class='user'>
        <input type="radio" id="${el.username}" name="${el.username}" value=${index} />
        <label for="${el.username}">${el.username}</label>
        </div>
        `;
      })
      .join('');
  };

  getUsersList = () => {
    this.toggleModalVisibility(this.modal, this.mask, true);
    const replies = this.data.reduce((prev, el) => {
      return [...prev, ...el.replies];
    }, []);

    this.usersList = this.getUsers([...this.data, ...replies]);
    this.renderUserList(this.usersList);
    this.content.addEventListener('click', this.manageRadio);
    this.setBtn.addEventListener('click', this.setNewCurrentUser);
  };

  getUsers = (arr) => {
    const usersList = [];
    for (const com in arr) {
      if (arr[com].user.username !== this.currentUser.username)
        usersList.push(arr[com].user);
    }

    return [
      ...new Map(usersList.map((item) => [item.username, item])).values(),
    ];
  };

  closeModal = () => {
    this.toggleModalVisibility(this.modal, this.mask, false);
    this.content.innerHTML = '';
    this.newUser = null;
  };

  manageRadio = (e) => {
    if (!e.target.getAttribute('type')) return;
    const radioButtons = document.querySelectorAll('.user input[type="radio"]');
    this.getNewCurrentUser(e.target.value);

    for (const radioButton of radioButtons) {
      radioButton.checked = false;
    }

    e.target.checked = true;
  };

  getNewCurrentUser = (val) => {
    this.newUser = this.usersList[val];
  };

  setNewCurrentUser = () => {
    this.toggleModalVisibility(this.modal, this.mask, false);
    localStorage.setItem('currUser', JSON.stringify(this.newUser));
    location.reload();
  };
}
