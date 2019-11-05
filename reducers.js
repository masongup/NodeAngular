import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'

import { loginStateActionType } from './consts.js'

const initialState = {
  role: null,
  userName: null,
  canEdit: false,
  token: null
};

function appReducer(state = initialState, action) {
  switch (action.type) {
    case loginStateActionType:
      return Object.assign({}, state, {
        role: action.role,
        userName: action.userName,
        canEdit: action.role === 'editor',
        token: action.token
      });
    default:
      return state;
  }
}

const createRootReducer = (history) => combineReducers({
  router: connectRouter(history),
  loginState: appReducer
});

export default createRootReducer;
