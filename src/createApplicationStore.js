import Immutable from 'immutable';
import {createStore, applyMiddleware} from 'redux';
import reducers from './reducers';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import config from './config';

let createStoreWithMiddleware = createStore;

if (config.logReduxActions()) {
  const logger = createLogger();
  createStoreWithMiddleware =
    applyMiddleware(logger)(createStoreWithMiddleware);
}

createStoreWithMiddleware =
  applyMiddleware(thunkMiddleware)(createStoreWithMiddleware);

function createApplicationStore() {
  return createStoreWithMiddleware(reducers, new Immutable.Map());
}

export default createApplicationStore;
