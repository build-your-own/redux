'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var calcInitialState = {
	num: 0
};

var calcReducer = exports.calcReducer = function calcReducer() {
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

var listReducer = exports.listReducer = function listReducer() {
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

var middleware1 = exports.middleware1 = function middleware1(_ref) {
	var getState = _ref.getState;

	return function (beforeDispatchFn) {
		return function finalDispatchFn(action) {
			console.log('will dispatch1', action);
			var returnValue = beforeDispatchFn(action);'';
			console.log('state after dispatch1', getState());
			return returnValue;
		};
	};
};

var middleware2 = exports.middleware2 = function middleware2(_ref2) {
	var getState = _ref2.getState;

	return function (beforeDispatchFn) {
		return function finalDispatchFn(action) {
			console.log('will dispatch2', action);
			var returnValue = beforeDispatchFn(action);'';
			console.log('state after dispatch2', getState());
			return returnValue;
		};
	};
};
//# sourceMappingURL=helper.js.map