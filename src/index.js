const combineReducers = (obj) => {
	const type = '@INIT';
	const initialState = {};
	const keys = Object.keys(obj);
	keys.forEach(key => {
		initialState[key] = obj[key](undefined, { type });
	});
	return function (state = initialState, action) {
		let nextState = Object.assign({}, state);
		if (action && action.type) {
			keys.forEach(key => {
				nextState[key] = obj[key](state[key], action);
			});
		}
		return nextState;
	}
};

const applyMiddleware = (...middlewares) =>
	createStore => (...args) => {
		const store = createStore(...args);
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
		const middlewareRes = middlewares.map(item => item(store));
		let composedMiddleware;
		if (middlewareRes.length === 1) {
			composedMiddleware = middlewareRes[0];
		} else {
			composedMiddleware = middlewareRes.reduce((a, b) => next => a(b(next)));
		}
		const newDispatch = composedMiddleware(store.dispatch);
		return ({
			...store,
			dispatch: newDispatch,
		});
	}

const createStore = (reducer, initialState, enhancedCreateStore) => {
	let state = initialState || reducer(undefined, { type: '@INIT' });
	if (enhancedCreateStore && typeof enhancedCreateStore === 'function') {
		return enhancedCreateStore(createStore)(reducer, initialState);
	}
	const result = {
		dispatch: (actionObj = {}) => {
			state = reducer(state || undefined, actionObj);
			return result;
		},
		// getState 返回当前的 store
		getState: () => {
			return state;
		},
	};
	return result;
};

export { createStore, combineReducers, applyMiddleware };
