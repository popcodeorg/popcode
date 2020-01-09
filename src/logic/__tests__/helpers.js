import configureStore from 'redux-mock-store';
import {createLogicMiddleware} from 'redux-logic';
import {first} from 'rxjs/operators';
import noop from 'lodash-es/noop';

export function makeTestLogic(logic) {
  return async (action, {state = {}, afterDispatch = noop} = {}) => {
    const logicMiddleware = createLogicMiddleware([logic]);
    const mockStore = configureStore([logicMiddleware]);
    const store = mockStore(state);

    const logicDone = logicMiddleware.monitor$
      .pipe(first(({op}) => op === 'end'))
      .toPromise();

    store.dispatch(action);
    await Promise.resolve();
    afterDispatch(store);
    await logicDone;

    const dispatch = jest.fn();
    for (const dispatchedAction of store.getActions()) {
      dispatch(dispatchedAction);
    }
    return dispatch;
  };
}
