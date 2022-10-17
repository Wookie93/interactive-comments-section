export class UserList {
  constructor(data, currUser) {
    this.data = data;
    this.currentUser = currUser;
    this.changeBtn = document.querySelector('.change-user');
    this.addUserBtn = document.querySelector('.add-user');
    this.closeBtn = document.querySelector('.modal__close');
    this.modal = document.querySelector('.modal.user-action');
    this.title = document.querySelector('.modal.user-action .modal__title');
    this.content = document.querySelector('.modal.user-action .modal__content');
    this.mask = document.querySelector('.mask');
    this.usersList = [];
    this.init();
  }

  init = () => {
    console.log('list is ready');
    console.log(this.data);
    this.addEvents();
  };

  addEvents = () => {
    this.changeBtn.addEventListener('click', this.getUsersList);
    this.addUserBtn.addEventListener('click', this.addNewUser);
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
    <h3>Logged as: ${this.currentUser.username}</h3>
    <h4>Change user</h4>
    `;
    this.content.innerHTML = arr
      .map((el) => {
        return `
        <p>${el}</p>
        `;
      })
      .join('');
  };

  getUsersList = () => {
    this.toggleModalVisibility(this.modal, this.mask, true);
    const replies = this.data.reduce((prev, el) => {
      return [...prev, ...el.replies];
    }, []);

    this.usersList = this.getUserName([...this.data, ...replies]);

    this.renderUserList(this.usersList);
  };

  getUserName = (arr) => {
    const nameList = [];
    for (const com in arr) {
      nameList.push(arr[com].user.username);
    }
    return [...new Set(nameList)];
  };

  closeModal = () => {
    this.toggleModalVisibility(this.modal, this.mask, false);
    this.content.innerHTML = '';
  };

  renderAddUserFrom = () => {
    return `
    <label>Name<lablel>
    <input type="text" />
    <div class="load-image"></div>
    <button>Add new user</button>
    `;
  };

  addNewUser = () => {
    this.toggleModalVisibility(this.modal, this.mask, true);
    this.content.innerHTML = this.renderAddUserFrom();
  };
}
