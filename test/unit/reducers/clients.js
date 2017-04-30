import test from 'tape';
import Immutable from 'immutable';
import partial from 'lodash/partial';
import reducer from '../../../src/reducers/clients';
import reducerTest from '../../helpers/reducerTest';
import {
  exportGist,
  gistExported,
  gistExportError,
  gistExportDisplayed,
  gistExportNotDisplayed,
} from '../../../src/actions/clients';
import {clients as states} from '../../helpers/referenceStates';

const url = 'https://gist.github.com/abc123';
const error = new Error();
const readyState = states.waiting.setIn(
  ['gists', 'lastExport'],
  Immutable.fromJS({status: 'ready', url}),
);

const errorState = states.waiting.setIn(
  ['gists', 'lastExport'],
  Immutable.fromJS({status: 'error', error}),
);

test('exportGist', reducerTest(
  reducer,
  states.initial,
  exportGist,
  states.waiting,
  'sets gists.lastExport.status to "waiting"',
));

test('gistExported', reducerTest(
  reducer,
  states.waiting,
  partial(gistExported, url),
  readyState,
  'it sets last export status to ready with gist URL',
));

test('gistExportError', reducerTest(
  reducer,
  states.waiting,
  partial(gistExportError, error),
  errorState,
  'it sets last export state to error with error object',
));

test('gistExportDisplayed', reducerTest(
  reducer,
  readyState,
  gistExportDisplayed,
  readyState,
  'it does not change last export state',
));

test('gistExportNotDisplayed', reducerTest(
  reducer,
  readyState,
  gistExportNotDisplayed,
  readyState,
  'it does not change last export state',
));
