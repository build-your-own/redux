const calcInitialState = {
	num: 0,
}

export const calcReducer = (state = calcInitialState, action) => {
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

export const listReducer = (state = listInitialState, action) => {
	switch (action.type) {
		case 'ADD':
			return { list: state.list.concat(action.item) };
		case 'DELETE':
			return { list: state.list.filter((item, index) => index !== action.index) };
		default:
			return state;
	}
}

export const middleware1 = ({ getState }) => {
	return beforeDispatchFn => {
		return function finalDispatchFn(action) {
			console.log('will dispatch1', action)
			const returnValue = beforeDispatchFn(action); ``
			console.log('state after dispatch1', getState())
			return returnValue
		}
	};
};

export const middleware2 = ({ getState }) => {
	return beforeDispatchFn => {
		return function finalDispatchFn(action) {
			console.log('will dispatch2', action)
			const returnValue = beforeDispatchFn(action); ``
			console.log('state after dispatch2', getState())
			return returnValue
		}
	};
};
