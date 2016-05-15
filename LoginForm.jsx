const React = require('react');
const securityService = require('./SecurityService.jsx');

module.exports = class LoginForm extends React.Component {
  componentDidMount() {
    //correctly get saved login status?
    //this.setState({ loggedIn: false });
  }

  render() {
    if(securityService.getIsLoggedIn()) {
      return <div>
        Welcome {securityService.getUserName()}! You are a {securityService.getRole()}.
        </div>;
    }
    else {
      return <div>
        <form>
          <div>
            <label for="username">Username</label>
            <input type="text" />
          </div>
        </form>
        </div>;
    }
  }
}
