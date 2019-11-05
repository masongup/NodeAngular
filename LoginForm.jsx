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
         <div>Welcome {this.props.userName}!</div>
         <div>You are a {this.props.role}.</div>
         <button className="btn btn-default" onClick={this.logout}>Logout</button>
        </div>;
    }
    else {
      return <div>
        <div>Welome, guest! Login below.</div>
        <form onSubmit={this.submitForm}>
          <div className="form-group" style={{ paddingRight: '10px' }}>
            <label htmlFor="username">Username</label>
            <input type="text" name="username" className="form-control" value={this.state.userName} onChange={this.changeUsername} />
          </div>
          <div className="form-group" style={{ paddingRight: '10px' }}>
            <label htmlFor="password">Password</label>
            <input type="password" name="password" className="form-control" value={this.state.password} onChange={this.changePassword} />
          </div>
          <div>
            <button className="btn btn-default" type="submit">Log In</button>
          </div>
        </form>
        </div>;
    }
  }
}

function matchStateToProps(state) {
  return { role: state.loginState.role, userName: state.loginState.userName };
}

module.exports = connect(matchStateToProps, securityActions)(LoginForm);
