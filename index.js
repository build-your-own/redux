
var redux = {
  state: undefined,
  reducer: undefined,
  dispatch: function (action) {
    const { type, payload } = action;
    this.state = this.reducer(this.state, action);
  },
  getState: function () {
    return this.state;
  },
  createStore: function (reducers, initialState) {
    console.log(this);
    console.log(reducers(this.state, { type: '@REDUX/INIT' }));
    this.reducer = reducers;
    
    this.dispatch({ type: '@REDUX/INIT' });
    return this;
  }
};

module.exports = redux;
