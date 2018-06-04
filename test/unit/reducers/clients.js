import test from 'tape';
import Immutable from 'immutable';
import partial from 'lodash-es/partial';

import reducer from '../../../src/reducers/clients';
import reducerTest from '../../helpers/reducerTest';
import {
  createSnapshot,
  snapshotCreated,
  snapshotExportError,
  exportProject,
  projectExported,
  projectExportError,
  projectExportDisplayed,
  projectExportNotDisplayed,
} from '../../../src/actions/clients';
import {clients as states} from '../../helpers/referenceStates';

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

test('project export', (t) => {
  const url = 'https://gist.github.com/abc123';
  const exportType = 'gist';
  const readyState = states.waitingForGist.setIn(
    ['projectExports', exportType],
    Immutable.fromJS({status: 'ready', url}),
  );

  const errorState = states.waitingForGist.setIn(
    ['projectExports', exportType],
    Immutable.fromJS({status: 'error'}),
  );

  t.test('exportProject', reducerTest(
    reducer,
    states.initial,
    partial(exportProject, exportType),
    states.waitingForGist,
    'sets gists.lastExport.status to "waiting"',
  ));

  t.test('projectExported', reducerTest(
    reducer,
    states.waitingForGist,
    partial(projectExported, url, exportType),
    readyState,
    'it sets last export status to ready with gist URL',
  ));

  t.test('projectExportError', reducerTest(
    reducer,
    states.waitingForGist,
    partial(projectExportError, exportType),
    errorState,
    'it sets last export state to error with error object',
  ));

  t.test('projectExportDisplayed', reducerTest(
    reducer,
    readyState,
    projectExportDisplayed,
    readyState,
    'it does not change last export state',
  ));

  t.test('projectExportNotDisplayed', reducerTest(
    reducer,
    readyState,
    projectExportNotDisplayed,
    readyState,
    'it does not change last export state',
  ));
});
