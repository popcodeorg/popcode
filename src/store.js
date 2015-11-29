var createStore = require('redux').createStore;
var reducers = require('./reducers');
var store = createStore(reducers);

module.exports = store;
