'use strict';

var _redux = require('redux');

var _helper = require('./helper');

var rootReducer = (0, _redux.combineReducers)({
	calc: _helper.calcReducer,
	list: _helper.listReducer
});

var store = (0, _redux.createStore)(rootReducer, (0, _redux.applyMiddleware)(_helper.middleware1, _helper.middleware2));

store.dispatch({ type: 'INCREASE' });
console.log(store.getState().calc);
//# sourceMappingURL=original-redux.js.map