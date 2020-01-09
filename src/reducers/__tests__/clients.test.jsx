import reduce from 'lodash-es/reduce';

import reducer from '../clients';

import {
  createSnapshot,
  snapshotCreated,
  snapshotExportError,
  exportProject,
  projectExported,
  projectExportError,
  gapiClientReady,
} from '../../actions/clients';
import {
  createAssignment,
  assignmentCreated,
  assignmentNotCreated,
} from '../../actions/assignments';

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

test('createAssignment sets exportingAssignment to true', () => {
  expect(applyActions(createAssignment()).get('exportingAssignment')).toEqual(
    true,
  );
});

test('assignmentCreated sets exportingAssignment to true', () => {
  expect(applyActions(assignmentCreated()).get('exportingAssignment')).toEqual(
    false,
  );
});

test('assignmentNotCreated sets exportingAssignment to true', () => {
  expect(
    applyActions(assignmentNotCreated()).get('exportingAssignment'),
  ).toEqual(false);
});

function applyActions(...actions) {
  return reduce(actions, (state, action) => reducer(state, action), undefined);
}
