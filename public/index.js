'use strict';

var _redux = require('./redux');

var calcInitialState = {
	num: 0
};

var calcReducer = function calcReducer() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : calcInitialState;
	var action = arguments[1];

	switch (action.type) {
		case 'INCREASE':
			return { num: state.num + 1 };
		case 'DECREASE':
			return { num: state.num - 1 };
		default:
			return state;
	}
};

var listInitialState = {
	list: []
};

var listReducer = function listReducer() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : listInitialState;
	var action = arguments[1];

	switch (action.type) {
		case 'ADD':
			return { list: state.list.concat(action.item) };
		case 'DELETE':
			return { list: state.list.filter(function (item, index) {
					return index !== action.index;
				}) };
		default:
			return state;
	}
};

var rootReducer = (0, _redux.combineReducers)({
	calc: calcReducer,
	list: listReducer
});

var store = (0, _redux.createStore)(rootReducer, undefined, (0, _redux.applyMiddleware)(function logger(_ref) {
	var getState = _ref.getState;

	return function (beforeDispatchFn) {
		return function finalDispatchFn(action) {
			console.log('will dispatch1', action);
			var returnValue = beforeDispatchFn(action);'';
			console.log('state after dispatch1', getState());
			return returnValue;
		};
	};
}, function logger(_ref2) {
	var getState = _ref2.getState;

	return function (beforeDispatchFn) {
		return function finalDispatchFn(action) {
			console.log('will dispatch2', action);
			var returnValue = beforeDispatchFn(action);'';
			console.log('state after dispatch2', getState());
			return returnValue;
		};
	};
}));

store.dispatch({ type: 'INCREASE' });
console.log(store.getState().calc); // { num: 1 }
//# sourceMappingURL=index.js.map