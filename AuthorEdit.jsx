const React = require('react');
const { serverUrl } = require('./consts.js');
const { Link, withRouter } = require('react-router');
const { connect } = require('react-redux');

class AuthorEdit extends React.Component {
  constructor(props) {
    super(props);
    this.saveAuthor = this.saveAuthor.bind(this);
    this.changeAuthorName = this.changeAuthorName.bind(this);
    this.state = { authorName: '' };
  }

  saveAuthor(event) {
    event.preventDefault();
    const fetchOptions = {
      body: JSON.stringify({ name: this.state.authorName }),
      method: 'POST',
      headers: new Headers({ 
        'Authorization': `Bearer ${this.props.token}`,
        'Content-Type': 'application/json' 
      })
    };
    fetch(`${serverUrl}authors`, fetchOptions)
      .then(resp => {
        this.props.router.push('/books');
      });
  }

  changeAuthorName(event) {
    this.setState({authorName: event.target.value });
  }

  render() {
    return <div>
      <form onSubmit={this.saveAuthor}>
        <div>
          <label htmlFor="AuthorName">Author Name</label>
          <input type="text" name="AuthorName" value={this.state.authorName} onChange={this.changeAuthorName} />
        </div>
        <div>
          <button type="submit">Save</button>
        </div>
      </form>
      </div>
  }
}

function matchStateToProps(state) {
  return { token: state.token };
}

module.exports = connect(matchStateToProps)(withRouter(AuthorEdit));
