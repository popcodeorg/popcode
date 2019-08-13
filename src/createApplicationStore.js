import {
  compose as composeWithoutDevTools,
  createStore,
  applyMiddleware,
} from 'redux';
import createSagaMiddleware from 'redux-saga';
import {createLogicMiddleware} from 'redux-logic';
import get from 'lodash-es/get';

import reducers from './reducers';
import rootSaga from './sagas';
import rootLogic from './logic';
import {bugsnagClient} from './util/bugsnag';

const compose = get(
  window,
  '__REDUX_DEVTOOLS_EXTENSION_COMPOSE__',
  composeWithoutDevTools,
);

export default function createApplicationStore() {
  const sagaMiddleware = createSagaMiddleware({
    onError(error) {
      if (get(console, 'error')) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
      bugsnagClient.notify(error);
    },
  });
  const sagaEnhancer = applyMiddleware(sagaMiddleware);

  const logicMiddleware = createLogicMiddleware(rootLogic);
  const logicEnhancer = applyMiddleware(logicMiddleware);

  const store = createStore(
    reducers,
    compose(
      sagaEnhancer,
      logicEnhancer,
    ),
  );
  sagaMiddleware.run(rootSaga);

  return store;
}
