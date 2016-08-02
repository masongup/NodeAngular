const { loginStateActionType } = require('./consts.js');

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

module.exports = appReducer;
