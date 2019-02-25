import { combineReducers, createStore, applyMiddleware } from 'redux';
import { calcReducer, listReducer, middleware1, middleware2 } from './helper';

const rootReducer = combineReducers({
	calc: calcReducer,
	list: listReducer,
});

const store = createStore(rootReducer, applyMiddleware(middleware1, middleware2));

store.dispatch({ type: 'INCREASE' });
console.log(store.getState().calc);
