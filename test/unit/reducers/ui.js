import test from 'tape';
import Immutable from 'immutable';
import partial from 'lodash/partial';
import reducerTest from '../../helpers/reducerTest';
import reducer from '../../../src/reducers/ui';
import {
  gistNotFound,
  gistImportError,
} from '../../../src/actions/projects';


const initialState = Immutable.fromJS({
  editors: {typing: false},
  requestedLine: null,
  minimizedComponents: new Immutable.Set(),
  notifications: new Immutable.Set(),
  dashboard: {
    isOpen: false,
    activeSubmenu: null,
  },
});

const gistId = '12345';

test('gistNotFound', reducerTest(
  reducer,
  initialState,
  partial(gistNotFound, gistId),
  initialState.update(
    'notifications',
    notifications => notifications.add(Immutable.fromJS({
      type: 'gist-import-not-found',
      severity: 'error',
      payload: {gistId},
    })),
  ),
));

test('gistImportError', reducerTest(
  reducer,
  initialState,
  partial(gistImportError, gistId),
  initialState.update(
    'notifications',
    notifications => notifications.add(Immutable.fromJS({
      type: 'gist-import-error',
      severity: 'error',
      payload: {gistId},
    })),
  ),
));
