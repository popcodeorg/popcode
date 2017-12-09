import {createStore, applyMiddleware} from 'redux';
import {composeWithDevTools as compose} from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import reducers from './reducers';
import rootSaga from './sagas';

export default function createApplicationStore() {
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(
    reducers,
    compose(applyMiddleware(sagaMiddleware)),
  );
  sagaMiddleware.run(rootSaga);
  return store;
}
