const React = require('react');
const securityActions = require('./securityActions.js');
const { connect } = require('react-redux');

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.changeUsername = this.changeUsername.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.logout = this.logout.bind(this);
    this.state = { userName: '', password: '' };
  }

  submitForm(event) {
    event.preventDefault();
    this.props.loginAction(this.state.userName, this.state.password);
  }

  logout() {
    this.props.logoutAction();
  }

  changeUsername(event) {
    this.setState({ userName: event.target.value });
  }

  changePassword(event) {
    this.setState({ password: event.target.value });
  }

  render() {
    if(this.props.role) {
      return <div>
        Welcome {this.props.userName}! You are a {this.props.role}. <a onClick={this.logout}>Logout</a>
        </div>;
    }
    else {
      return <div>
        <form onSubmit={this.submitForm}>
          <div>
            <label htmlFor="username">Username</label>
            <input type="text" name="username" value={this.state.userName} onChange={this.changeUsername} />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input type="password" name="password" value={this.state.password} onChange={this.changePassword} />
          </div>
          <div>
            <button type="submit">Log In</button>
          </div>
        </form>
        </div>;
    }
  }
}

function matchStateToProps(state) {
  return { role: state.role, userName: state.userName };
}

module.exports = connect(matchStateToProps, securityActions)(LoginForm);
