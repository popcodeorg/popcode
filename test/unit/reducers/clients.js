import test from 'tape';
import Immutable from 'immutable';
import partial from 'lodash/partial';
import reducer from '../../../src/reducers/clients';
import reducerTest from '../../helpers/reducerTest';
import {
  createSnapshot,
  snapshotCreated,
  snapshotExportError,
  exportGist,
  gistExported,
  gistExportError,
  gistExportDisplayed,
  gistExportNotDisplayed,
} from '../../../src/actions/clients';
import {clients as states} from '../../helpers/referenceStates';

const error = new Error();

test('snapshot export', (t) => {
  t.test('createSnapshot', reducerTest(
    reducer,
    states.initial,
    createSnapshot,
    states.waitingForSnapshot,
    'sets clients.firebase.exportingSnapshot to true',
  ));

  t.test('snapshotCreated', reducerTest(
    reducer,
    states.waitingForSnapshot,
    snapshotCreated,
    states.initial,
    'sets clients.firebase.exportingSnapshot to false',
  ));

  t.test('snapshotExportError', reducerTest(
    reducer,
    states.waitingForSnapshot,
    snapshotExportError,
    states.initial,
    'sets clients.firebase.exportingSnapshot to false',
  ));
});

test('gist export', (t) => {
  const url = 'https://gist.github.com/abc123';
  const readyState = states.waitingForGist.setIn(
    ['gists', 'lastExport'],
    Immutable.fromJS({status: 'ready', url}),
  );

  const errorState = states.waitingForGist.setIn(
    ['gists', 'lastExport'],
    Immutable.fromJS({status: 'error', error}),
  );

  t.test('exportGist', reducerTest(
    reducer,
    states.initial,
    exportGist,
    states.waitingForGist,
    'sets gists.lastExport.status to "waiting"',
  ));

  t.test('gistExported', reducerTest(
    reducer,
    states.waitingForGist,
    partial(gistExported, url),
    readyState,
    'it sets last export status to ready with gist URL',
  ));

  t.test('gistExportError', reducerTest(
    reducer,
    states.waitingForGist,
    partial(gistExportError, error),
    errorState,
    'it sets last export state to error with error object',
  ));

  t.test('gistExportDisplayed', reducerTest(
    reducer,
    readyState,
    gistExportDisplayed,
    readyState,
    'it does not change last export state',
  ));

  t.test('gistExportNotDisplayed', reducerTest(
    reducer,
    readyState,
    gistExportNotDisplayed,
    readyState,
    'it does not change last export state',
  ));
});
