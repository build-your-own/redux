
const redux = require('../index');

const CHANGE_NAME = 'CHANGE_NAME';

const reducerInitialState = {
  name: 'bob',
  age: 20,
};

exports.tReducer = function (reducerInitialState = reducerInitialState, action) {
  switch (action.type) {
    case CHANGE_NAME:
      return {
        reducerInitialState,
        name: action.payload,
      };
    default:
      return reducerInitialState;
  }
}

const store = redux.createStore(tReducer);

store.dispatch({
  type: CHANGE_NAME,
  payload: Math.random(),
});

console.log(store.getState());