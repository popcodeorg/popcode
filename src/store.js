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

const store = createStoreWithMiddleware(reducers);

export default store;
