const React = require('react');
const { Router, Route, Link, browserHistory } = require('react-router');
const BookEdit = require('./BookEdit.jsx');
const BookDetails = require('./BookDetails.jsx');
const securityService = require('./SecurityService.jsx');
const BookList = require('./BookList.jsx');
const LoginForm = require('./LoginForm.jsx');

class Home extends React.Component {
  render() {
    return <div><h1>Hello, World!</h1>
        <p><Link to={"books"}>Book List</Link></p>
        <div><LoginForm /></div>
        <div>{this.props.children}</div>
      </div>;
  }
}

securityService.login('Mason', 'Password-1');

module.exports = class Base extends React.Component {
  render() {
    return (
        <Router history={browserHistory}>
          <Route path="/" component={Home}>
            <Route path="/books" component={BookList}/>
            <Route path="/book/new" component={BookEdit}/>
            <Route path="/book/:bookId" component={BookDetails}/>
            <Route path="/book/:bookId/edit" component={BookEdit}/>
          </Route>
        </Router>);
  }
}
