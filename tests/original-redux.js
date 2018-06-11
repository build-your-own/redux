const redux = require('redux');
const thunk = require('redux-thunk').default;

const { createStore, applyMiddleware, combineReducers } = redux;

const tInitialState = {
  name: 'bob',
  age: 20,
};

const CHANGE_NAME = 'CHANGE_NAME';
const UPDATE_AGE = 'UPDATE_AGE';

const UPDATE_LIST = 'UPDATE_LIST';

const mockReceive = () => dispatch => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(1000);
    }, 1000);
  })
}

const receiveAge = () => (dispatch, getState) => {
  return dispatch(mockReceive()).then(((res) => {
    console.log(res);
  }))
}


const tReducer = function (state = tInitialState, action) {
  switch (action.type) {
    case CHANGE_NAME:
      return {
        ...state,
        name: 'changed name',
      }
    case UPDATE_AGE:
      return {
        ...state,
        name: action.payload,
      }
    default:
      return state;
  }
}

const lInitialState = {
  list: [],
}

const lReducer = function (state = lInitialState, action) {
  switch (action.type) {
    case UPDATE_LIST:
      return {
        ...state,
        list: ['bob'],
      }
    default:
      return lInitialState;
  }
}

const testReduxMiddleware = ({ getState, dispatch }) => next => action => {
  console.log(action);
  return next(action);
}

const rootReducer = combineReducers({ tReducer, lReducer });

const enhancerStore = applyMiddleware(thunk.withExtraArgument({ test: true }), testReduxMiddleware); // enhance createStore function

const store = createStore(rootReducer, enhancerStore);  // createStore

console.log(store.getState()); 

store.dispatch({ type: CHANGE_NAME });

store.dispatch(receiveAge()).then(res => {
  console.log(res);
});

console.log(store.getState());

