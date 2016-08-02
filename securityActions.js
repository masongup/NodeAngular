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
      type: loginStateActionType,
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
  loginAction,
  logoutAction
}
