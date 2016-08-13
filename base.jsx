require('jquery');
require('expose?$!expose?jQuery!jquery');
const React = require('react');
const { Router, Route, Link, browserHistory } = require('react-router');
const BookEdit = require('./BookEdit.jsx');
const BookDetails = require('./BookDetails.jsx');
const BookList = require('./BookList.jsx');
const LoginForm = require('./LoginForm.jsx');
const AuthorEdit = require('./AuthorEdit.jsx');
const { createStore, applyMiddleware } = require('redux');
const { Provider } = require('react-redux');
const thunkMiddleware = require('redux-thunk').default;
const appReducer = require('./reducers.js');
const { tryLoginFromLocalStorage } = require('./securityActions.js');
require('bootstrap-webpack');

const store = createStore(appReducer, applyMiddleware(thunkMiddleware));

store.dispatch(tryLoginFromLocalStorage());

class Home extends React.Component {
  render() {
    return <div><div className="row">
        <div className="col-sm-4 col-sm-offset-1">
          <h1>A Book List Site</h1>
          <p><Link to={"/books"}>Book List</Link></p>
        </div>
        <div className="col-sm-2 col-sm-offset-5"><LoginForm /></div>
      </div>
      <div style={{"marginLeft": "20px"}}>{this.props.children}</div>
      </div>;
  }
}

module.exports = class Base extends React.Component {
  render() {
    return (
        <Provider store={store}>
          <Router history={browserHistory}>
            <Route path={baseRoute} component={Home}>
              <Route path="/books" component={BookList}/>
              <Route path="/book/new" component={BookEdit}/>
              <Route path="/book/:bookId" component={BookDetails}/>
              <Route path="/book/:bookId/edit" component={BookEdit}/>
              <Route path="/author/new" component={AuthorEdit}/>
            </Route>
          </Router>
        </Provider>);
  }
}
