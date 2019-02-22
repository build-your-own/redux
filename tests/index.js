import { applyMiddleware, createStore, combineReducers } from './redux';

const calcInitialState = {
	num: 0,
}

const calcReducer = (state = calcInitialState, action) => {
	switch (action.type) {
		case 'INCREASE':
			return { num: state.num + 1 };
		case 'DECREASE':
			return { num: state.num - 1 };
		default:
			return state;
	}
}

const listInitialState = {
	list: [],
}

const listReducer = (state = listInitialState, action) => {
	switch (action.type) {
		case 'ADD':
			return { list: state.list.concat(action.item) };
		case 'DELETE':
			return { list: state.list.filter((item, index) => index !== action.index) };
		default:
			return state;
	}
}

const rootReducer = combineReducers({
	calc: calcReducer,
	list: listReducer,
});

const store = createStore(rootReducer, undefined, applyMiddleware(
	function logger({ getState }) {
		return beforeDispatchFn => {
			return function finalDispatchFn(action) {
				console.log('will dispatch', action)
				const returnValue = beforeDispatchFn(action); ``
				console.log('state after dispatch', getState())
				return returnValue
			}
		};
	}
));

store.dispatch({ type: 'INCREASE' });
console.log(store.getState().calc); // { num: 1 }
