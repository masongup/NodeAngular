const { serverUrl } = require('./consts.js');

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

  logout() {
    this.isLoggedIn = false;
    this.role = null;
    this.userName = null;
    //localStorageService.remove('Token');
  }

  getIsLoggedIn() {
    return this.isLoggedIn;
  }
  canEdit() {
    return this.role === 'editor';
  }
  getUserName() {
    return this.userName;
  }
  getRole() {
    return this.role;
  }
  getToken() {
    return this.token;
  }

  processToken(t) {
    const dataPart = t.split('.')[1];
    const data = JSON.parse(atob(dataPart));
    this.userName = data.username;
    this.role = data.role;
    if (!this.userName || !this.role) {
      this.logout();
      return;
    }
    this.token = t;
    this.isLoggedIn = true;
  }
}

module.exports = new SecurityService();
