const { serverUrl } = require('./consts.js');
const { createStore } = require('redux');

const initialState = {
  role: null,
  userName: null,
  canEdit: false,
  token: null
};

function appReducer(state = initialState, action) {
  switch (action.type) {
    case 'SetLoginState':
      return Object.assign({}, state, {
        role: action.role,
        userName: action.userName,
        canEdit: action.role === 'editor',
        token: action.token
      });
    default:
      return state;
  }
}

const store = createStore(appReducer);

class SecurityService {

  login(username, password) {
    return fetch(`${serverUrl}rpc/login`, {
        method: 'POST',
        body: JSON.stringify( { username: username, password: password }),
        headers: new Headers({ 'Content-Type': 'application/json' })
      })
      .then(resp => resp.json())
      .then(data => {
        const t = data.token;
        if (t) {
          this.processToken(t);
          //localStorageService.set('Token', t);
        }
        else {
          this.logout();
        }
      });
  }

  createLoginChangeAction(newRole, userName, token) {
    return {
        type: 'SetLoginState',
        role: newRole,
        userName: userName,
        token: token
    };
  }

  logout() {
    //localStorageService.remove('Token');
    store.dispatch(this.createLoginChangeAction());
  }

  getIsLoggedIn() {
    return store.getState().role !== null;
  }
  canEdit() {
    return store.getState().role === 'editor';
  }
  getUserName() {
    return store.getState().userName;
  }
  getRole() {
    return store.getState().role;
  }
  getToken() {
    return store.getState().token;
  }

  processToken(t) {
    const dataPart = t.split('.')[1];
    const data = JSON.parse(atob(dataPart));
    if (!data.username || !data.role) {
      this.logout();
      return;
    }
    store.dispatch(this.createLoginChangeAction(data.role, data.username, t));
  }
}

module.exports = new SecurityService();
