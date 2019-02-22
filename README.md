# Build your own redux
> 学习一种工具最好的方法是创造它。

# 如何使用 redux
让我们先看看，平时我们是如何使用redux的。让我们从一个简单的 increase/decrease 应用开始
## Step1 - create reducer
我们首先要设计好应用的数据结构，然后构建一个 *reducer*。之后通过 `createStore` 函数来构造 *store*。
```js
// reducer.js
const initialState = {
  num: 0,
};

const reducer = (state, action) => initialState;

export default reducer;
```
```js
// store.js
import { createStore } from 'redux';
import reducer from './reducer';

const store = createStore(reducer);
```
## Step2 - create action
现在，让我们定义几个 *action*，然后在 *reducer* 中，为不同的 *action* 设置不同的返回值。
```js
// action.js
export const INCREASE = 'INCREASE';
export const DECREASE = 'DECREASE';
```
```js
// reducer.js
import { INCREASE, DECREASE } from './action';
const initialState = {
  num: 0,
};

const reducer = (state = initialState, action) => {
  switch(action.type) {
    case INCREASE:
      return { num: state.num + 1 };
    case DECREASE:
      return { num: state.num - 1 };
    default:
      return state;
  }
};

export default reducer;
```
## Step3 - use store.dispatch()
在定义好了 *reducer* 与 *action* 之后，我们就可以通过调用绑定在 *store* 上的 `store.dispatch()` 函数来执行我们定义的 *action*。我们之后也可以使用 `store.getState()` 函数来获取当前的 *store*。
```js
// store.js
import { createStore } from 'redux';
import reducer from './reducer';
import { INCREASE, DECREASE } from './action';

const store = createStore(reducer);

store.dispatch({ type: INCREASE });
console.log(store.getState()); // { num: 1 }
store.dispatch({ type: INCREASE });
console.log(store.getState()); // { num: 2 }
store.dispatch({ type: DECREASE });
console.log(store.getState()); // { num: 1 }
```
这就是最简单的一个  **redux** 提供的能力。现在，我们从 `store.dispatch()`，来寻找 **redux** 的编写思路。

# 从 store 开始
我们需要可以调用绑定在 `createStore()` 函数返回值上的 `dispatch` 和 `getState` 函数。同时，根据这两个函数的参数与返回值，我们尝试着实现这两个函数：
```js
const createStore = (reducer, initialState) => {
  let state = initialState || reducer(undefined, { type: '@INIT' });
  const result = {
    dispatch: (actionObj = {}) => {
      state = reducer(state || undefined, actionObj);
      return result;
    },
    // getState 返回当前的 store
    getState: () => {
      return state;
    }
  };
  return result;
};
```
到这里，我们实际上已经实现了 **redux** 最核心的部分。但在实际生产环境中，我们可能会将reducer拆分为更细致的reducer，因此 **redux** 提供了 `combineReducers()` 函数，用来将我们拆分出的 *reducer* 合并为一个。接下来我们来实现这个函数。
```js
// combineReducers.test.js
import combineReducers from './combineReducers';

describe('test combineReducers', () => {
  it('multi reducer should be combined', () => {
    const reducer1 = (state = 0) => state;
    const reducer2 = (state = true) => state;
    const reducer3 = () => ({ reducer1: 0, reducer2: true });
     assert(
       JSON.stringify(combineReducers({ reducer1, reducer2 })())
     ).should.equal(
       JSON.stringify(reducer3())
    );
  });
});
```
```js
// combineReducers.js
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

export default combineReducers;
```
# enhance dispatch
我们在使用 **redux** 开发的时候，还知道用 **redux** 提供了 `aplyMiddleware()` 函数，为 `store.dispatch()` 提供了中间件的功能。例如。我们可以在调用 `dispatch` 时打印出当前的 *action*：

```js
const store = createStore(
  reducer,
  undefined,
  applyMiddleware(
    function logger({ getState }) {
      return beforeDispatchFn => {
        return function finalDispatchFn(action) {
          console.log('will dispatch', action)
          const returnValue = beforeDispatchFn(action);``
          console.log('state after dispatch', getState())
          return returnValue
        }
      };
    }
  ),
);
```
为了实现这个函数，我们先在 **redux** 官网看一下官方对于此函数的解释:
> **Arguments**
> `...middleware (arguments)`: Functions that conform to the Redux middleware API. Each middleware receives Store's dispatch and getState functions as named arguments, and returns a function. That function will be given the next middleware's dispatch method, and is expected to return a function of `action` calling `next(action)` with a potentially different argument, or at a different time, or maybe not calling it at all. The last middleware in the chain will receive the real store's `dispatch` method as the `next` parameter, thus ending the chain. So, the middleware signature is `({ getState, dispatch }) => next => action`.
> **Returns**
> (Function) A store enhancer that applies the given middleware. The store enhancer signature is `createStore => createStore` but the easiest way to apply it is to pass it to createStore() as the last `enhancer` argument.

简单来说，*middleware* 的函数签名为 `({ getState, dispatch }) => next => action`, *applyMiddleware* 同样返回一个函数，此函数的签名为 `createStore => createStore`。其中，middleware通过接受上一个middleware返回的包装过的 `dispatch` 串联起来。
之所以这样设计，应该有以下两点考虑：
- store 对象上一些很有用的api，如 `getState`，可以在middleware中使用
- next 函数为上一个 middleware 返回过来的包装过的 dispatch 函数。保证了每一个 middleware 都只会被调用一次
现在，我们按照官方的函数签名来实现 `applyMiddleware` 函数。

首先，让我们来实现一个最基本的函数：
```js
const applyMiddleware = (...middlewares) =>
  createStore => {
    const store = createStore();
    return store;
  }
```
接下来，我们需要获得通过一连串 *middleware* 装饰之后的 *dispatch* 函数。这里我们先定义一个 *middleware*，然后再看用什么方式来串联起来：
```js
// 定义两个 middleware
const myMiddleware1 = (store) => next => action => {
  console.log('myMiddleware1 has been called!');
  return next(action);
}
const myMiddleware2 = (store) => next => action => {
  console.log('myMiddleware2 has been called!');
  return next(action);
}
// 使用middleware
const store = createStore(
  reducer,
  null,
  applyMiddleware(myMiddleware1, myMiddleware2)
);
```
这时候，让我们回头再看一下最初我们定义的 `dispatch` 函数：
```js
dispatch: (actionObj = {}) => {
  state = reducer(result.state || null, actionObj);
  return result;
}
```
可以看到，中间件最终都是返回的 `next(action)`，所以我们可以通过 `reduce` 函数将 *middleware* 串联起来即可。所以：
```js
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
    if(middlewareRes.length === 1) {
      composedMiddleware = middlewareRes[0];
    } else {
      const composedMiddleware = middlewareRes.reduce((a, b) => next => a(b(next)));
    }
    const newDispatch = composedMiddleware(store.dispatch);
    return ({
       ...store,
       dispatch: newDispatch,
    });
  }
```
这样，我们就实现了一个简单的 `applyMiddleware`。但我们还需要对 `createStore` 函数做一些改动，来让他支持 `applyMiddleware` 参数。
```js
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
    }
  };
  return result;
};
```
# 完整的实现
到目前，我们已经实现了 `createStore`、`combineReducer`、`applyMiddleware` 这三个关键 API。让我们完整的回顾一下到目前为止的代码：
```js
// redux.js
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
        console.log(state);
        nextState[key] = obj[key](state[key], action);
      });
    }
    return nextState;
  }
};

const applyMiddleware = (...middlewares) =>
  createStore => {
    const store = createStore();
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
    if(middlewareRes.length === 1) {
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
    }
  };
  return result;
};

export { createStore, combineReducers, applyMiddleware };
```
不到100行的代码。让我们随便写一点代码来测试一下：
```js
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

const store = createStore(rootReducer);

store.dispatch({ type: 'INCREASE' });
console.log(store.getState().calc); // { num: 1 }
store.dispatch({ type: 'DECREASE' });
console.log(store.getState().calc); // { num: 0 }
store.dispatch({ type: 'ADD', item: 2 });
console.log(store.getState().list); // { list: [2] }
store.dispatch({ type: 'ADD', item: 3 });
console.log(store.getState().list); // { list: [2, 3] }
store.dispatch({ type: 'DELETE', index: 0 });
console.log(store.getState().list); // { list: [3] }
```
接下来让我们测试一下 `applyMiddleware` 函数。我们把之前写的输出log的 middleware 放到我们的这个 store 中：
```js
const store = createStore(rootReducer, undefined, applyMiddleware(logger));
store.dispatch({ type: 'INCREASE' }); // log: will dispatch, state after dispatch 
```
可以看到，我们的中间件也能够成功运行了。至此，*redux* 的大部分功能我们已经实现了。实现的虽然有些瑕疵，但我们主要关心的还是 *redux* 整体的设计思路。更多的也是学习这种编程思路。