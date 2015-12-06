var redux = require('redux');
var createStore = redux.createStore;
var applyMiddleware = redux.applyMiddleware;
var reducers = require('./reducers');
var thunkMiddleware = require('redux-thunk').thunkMiddleware;

var createStoreWithMiddleware = applyMiddleware(thunkMiddleware)(createStore);

var store = createStoreWithMiddleware(reducers);

module.exports = store;
