const { serverUrl } = require('./consts.js');
const { createStore, applyMiddleware } = require('redux');
const thunkMiddleware = require('redux-thunk').default;

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

const store = createStore(appReducer, applyMiddleware(thunkMiddleware));

function loginAction(username, password) {
  return function(dispatch) {
    fetch(`${serverUrl}rpc/login`, {
        method: 'POST',
        body: JSON.stringify( { username: username, password: password }),
        headers: new Headers({ 'Content-Type': 'application/json' })
      })
      .then(resp => resp.json())
      .then(data => {
        const t = data.token;
        if (t) {
          processToken(dispatch, t);
          //localStorageService.set('Token', t);
        }
        else {
          dispatch(logoutAction());
        }
      });
  }
}

function createLoginChangeAction(newRole, userName, token) {
  return {
      type: 'SetLoginState',
      role: newRole,
      userName: userName,
      token: token
  };
}

function logoutAction() {
  //localStorageService.remove('Token');
  return createLoginChangeAction();
}

function processToken(dispatch, t) {
  const dataPart = t.split('.')[1];
  const data = JSON.parse(atob(dataPart));
  if (!data.username || !data.role) {
    this.logout();
    return;
  }
  dispatch(createLoginChangeAction(data.role, data.username, t));
}

module.exports = { 
  store,
  actionCreators: {
    loginAction,
    logoutAction
  }
}
