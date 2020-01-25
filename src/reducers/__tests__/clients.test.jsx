import reduce from 'lodash-es/reduce';

import {
  createSnapshot,
  exportProject,
  gapiClientReady,
  projectExported,
  projectExportError,
  snapshotCreated,
  snapshotExportError,
} from '../../actions/clients';
import reducer from '../clients';

test('createSnapshot sets exportingSnapshot to true', () => {
  expect(
    applyActions(createSnapshot()).getIn(['firebase', 'exportingSnapshot']),
  ).toEqual(true);
});

test('snapshotCreated sets exportingSnapshot to false', () => {
  expect(
    applyActions(snapshotCreated()).getIn(['firebase', 'exportingSnapshot']),
  ).toEqual(false);
});

test('snapshotExportError sets exportingSnapshot to false', () => {
  expect(
    applyActions(snapshotExportError()).getIn([
      'firebase',
      'exportingSnapshot',
    ]),
  ).toEqual(false);
});

test('exportProject sets export status to waiting', () => {
  expect(
    applyActions(exportProject('gist')).getIn([
      'projectExports',
      'gist',
      'status',
    ]),
  ).toEqual('waiting');
});

test('projectExported sets export status to ready', () => {
  expect(
    applyActions(projectExported('example.com', 'gist', '', null)).getIn([
      'projectExports',
      'gist',
      'status',
    ]),
  ).toEqual('ready');
});

test('projectExportError sets export status to error', () => {
  expect(
    applyActions(projectExportError('gist')).getIn([
      'projectExports',
      'gist',
      'status',
    ]),
  ).toEqual('error');
});

test('gapiClientReady sets gapi ready to true', () => {
  expect(
    applyActions(gapiClientReady('gist')).getIn(['gapi', 'ready']),
  ).toEqual(true);
});

function applyActions(...actions) {
  return reduce(actions, (state, action) => reducer(state, action), undefined);
}
