import Immutable from 'immutable';
import {createLogger} from 'redux-logger';
import {createStore, applyMiddleware} from 'redux';
import createSagaMiddleware from 'redux-saga';
import reducers from './reducers';
import config from './config';
import rootSaga from './sagas';

let createStoreWithMiddleware = createStore;

if (config.logReduxActions()) {
  const logger = createLogger();
  createStoreWithMiddleware =
    applyMiddleware(logger)(createStoreWithMiddleware);
}

const sagaMiddleware = createSagaMiddleware();
createStoreWithMiddleware =
  applyMiddleware(sagaMiddleware)(createStoreWithMiddleware);

let devToolsExtension;

if (window.__REDUX_DEVTOOLS_EXTENSION__) {
  devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__();
}

function createApplicationStore() {
  const store = createStoreWithMiddleware(
    reducers,
    new Immutable.Map(),
    devToolsExtension,
  );
  sagaMiddleware.run(rootSaga);
  return store;
}

export default createApplicationStore;
