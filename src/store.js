var redux = require('redux');
var createStore = redux.createStore;
var applyMiddleware = redux.applyMiddleware;
var reducers = require('./reducers');
var thunkMiddleware = require('redux-thunk');
var createLogger = require('redux-logger');

var logger = createLogger();
var createStoreWithMiddleware =
  applyMiddleware(thunkMiddleware, logger)(createStore);

var store = createStoreWithMiddleware(reducers);

module.exports = store;
