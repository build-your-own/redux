import { applyMiddleware, createStore, combineReducers } from './redux';
import { calcReducer, listReducer, middleware1, middleware2 } from './helper';

const rootReducer = combineReducers({
	calc: calcReducer,
	list: listReducer,
});

const store = createStore(rootReducer, undefined, applyMiddleware(middleware1, middleware2));

store.dispatch({ type: 'INCREASE' });
console.log(store.getState().calc); // { num: 1 }
