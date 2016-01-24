var redux = require('redux');
var createStore = redux.createStore;
var applyMiddleware = redux.applyMiddleware;
var reducers = require('./reducers');
var thunkMiddleware = require('redux-thunk');
var createLogger = require('redux-logger');
var config = require('./config');

if (config.logReduxActions()) {
  var logger = createLogger();
  createStore = applyMiddleware(logger)(createStore);
}

createStore = applyMiddleware(thunkMiddleware)(createStore);

var store = createStore(reducers);

module.exports = store;
