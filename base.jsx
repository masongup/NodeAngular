//require('jquery');
//require('expose?$!expose?jQuery!jquery');
import React from 'react';
import { Router, Route, Link, Switch } from 'react-router-dom';
import BookEdit from './BookEdit.jsx';
import BookDetails from './BookDetails.jsx';
import BookList from './BookList.jsx';
import LoginForm from './LoginForm.jsx';
import AuthorEdit from './AuthorEdit.jsx';
import { createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import createRootReducer from './reducers.js'
import { tryLoginFromLocalStorage } from './securityActions.js';
import { ConnectedRouter, routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';

//require('bootstrap-webpack');

const history = createBrowserHistory();
const store = createStore(createRootReducer(history), {}, compose(applyMiddleware(thunkMiddleware, routerMiddleware(history))));

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
        <div style={{"marginLeft": "20px"}}>
          <Switch>
            <Route path="/books" component={BookList}/>
            <Route path="/book/new" component={BookEdit}/>
            <Route path="/book/:bookId" component={BookDetails}/>
            <Route path="/book/:bookId/edit" component={BookEdit}/>
            <Route path="/author/new" component={AuthorEdit}/>
          </Switch>
        </div>
      </div>;
  }
}

class Base extends React.Component {
  render() {
    return (
        <Provider store={store}>
          <ConnectedRouter history={history}>
            <Route path={'/'} component={Home}/>
          </ConnectedRouter>
        </Provider>);
  }
}

export default Base;
