'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var combineReducers = function combineReducers(obj) {
	var type = '@INIT';
	var initialState = {};
	var keys = Object.keys(obj);
	keys.forEach(function (key) {
		initialState[key] = obj[key](undefined, { type: type });
	});
	return function () {
		var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
		var action = arguments[1];

		var nextState = Object.assign({}, state);
		if (action && action.type) {
			keys.forEach(function (key) {
				nextState[key] = obj[key](state[key], action);
			});
		}
		return nextState;
	};
};

var applyMiddleware = function applyMiddleware() {
	for (var _len = arguments.length, middlewares = Array(_len), _key = 0; _key < _len; _key++) {
		middlewares[_key] = arguments[_key];
	}

	return function (createStore) {
		return function () {
			var store = createStore.apply(undefined, arguments);
			/** 获取装饰过的 dispatch
     * 最终得到的 middlewareRes 为：
     * [
     *   function anonymousFn1(next) {
     *      return function fn1(action) {
     *        console.log('middleware1');
     *        return next(action);
     *      }
     *   },
     *   function anonymousFn2(next) {
     *      return function fn2(action) {
     *        console.log('middleware2');
     *        return next(action);
     *      }
     *   }
     * ]
     */
			var middlewareRes = middlewares.map(function (item) {
				return item(store);
			});
			var composedMiddleware = void 0;
			if (middlewareRes.length === 1) {
				composedMiddleware = middlewareRes[0];
			} else {
				composedMiddleware = middlewareRes.reduce(function (a, b) {
					return function (next) {
						return a(b(next));
					};
				});
			}
			var newDispatch = composedMiddleware(store.dispatch);
			return _extends({}, store, {
				dispatch: newDispatch
			});
		};
	};
};

var createStore = function createStore(reducer, initialState, enhancedCreateStore) {
	var state = initialState || reducer(undefined, { type: '@INIT' });
	if (enhancedCreateStore && typeof enhancedCreateStore === 'function') {
		return enhancedCreateStore(createStore)(reducer, initialState);
	}
	var result = {
		dispatch: function dispatch() {
			var actionObj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

			state = reducer(state || undefined, actionObj);
			return result;
		},
		// getState 返回当前的 store
		getState: function getState() {
			return state;
		}
	};
	return result;
};

exports.createStore = createStore;
exports.combineReducers = combineReducers;
exports.applyMiddleware = applyMiddleware;
//# sourceMappingURL=redux.js.map