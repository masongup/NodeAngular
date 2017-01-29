const { serverUrl, loginStateActionType } = require('./consts.js');

function loginAction(username, password) {
  return function(dispatch) {
    fetch(`${serverUrl}rpc/login`, {
        method: 'POST',
        body: JSON.stringify( { username: username, password: password }),
        headers: new Headers({ 'Content-Type': 'application/json' })
      })
      .then(resp => resp.json())
      .then(data => {
        const t = data;
        if (t) {
          if (processToken(dispatch, t)) {
            tryStoreToken(t);
          }
        }
        else {
          dispatch(logoutAction());
        }
      });
  }
}

function createLoginChangeAction(newRole, userName, token) {
  return {
      type: loginStateActionType,
      role: newRole,
      userName: userName,
      token: token
  };
}

function logoutAction() {
  tryClearLocalStorageToken();
  return createLoginChangeAction();
}

function processToken(dispatch, t) {
  const dataPart = t.split('.')[1];
  const data = JSON.parse(atob(dataPart));
  if (!data.username || !data.role) {
    this.logout();
    return false;
  }
  dispatch(createLoginChangeAction(data.role, data.username, t));
  return true;
}

function tryStoreToken(t) {
  tryLocalStorageTask(s => s.setItem('AppToken', t));
}

function tryLoginFromLocalStorage() {
  return function(dispatch) {
    tryLocalStorageTask(s => {
      const token = s.getItem('AppToken');
      if (token) {
        processToken(dispatch, token);
      }
    });
  };
}

function tryClearLocalStorageToken() {
  tryLocalStorageTask(s => s.removeItem('AppToken'));
}

function tryLocalStorageTask(task) {
  if (!window.localStorage) {
    return;
  }
  try {
    task(window.localStorage);
  }
  catch (e) {
  }
}

module.exports = { 
  loginAction,
  logoutAction,
  tryLoginFromLocalStorage
}
