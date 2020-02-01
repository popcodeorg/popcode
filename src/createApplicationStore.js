import get from 'lodash-es/get';
import {
  applyMiddleware,
  compose as composeWithoutDevTools,
  createStore,
} from 'redux';
import {createLogicMiddleware} from 'redux-logic';
import createSagaMiddleware from 'redux-saga';

import rootLogic from './logic';
import reducers from './reducers';
import rootSaga from './sagas';
import {bugsnagClient} from './util/bugsnag';

const compose = get(
  window,
  ['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'],
  composeWithoutDevTools,
);

export default function createApplicationStore() {
  const sagaMiddleware = createSagaMiddleware({
    onError(error) {
      if (get(console, ['error'])) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
      bugsnagClient.notify(error);
    },
  });

  const logicMiddleware = createLogicMiddleware(rootLogic);

  const middlewares = applyMiddleware(logicMiddleware, sagaMiddleware);

  const store = createStore(reducers, compose(middlewares));
  sagaMiddleware.run(rootSaga);

  return store;
}
