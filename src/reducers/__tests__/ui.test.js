import Immutable from 'immutable';
import reduce from 'lodash-es/reduce';

import {
  applicationLoaded,
  cancelEditingInstructions,
  clearConsoleEntries,
  linkGithubIdentity,
  projectCompilationFailed,
  projectCompiled,
  startEditingInstructions,
  toggleTopBarMenu,
  unlinkGithubIdentity,
  updateProjectInstructions,
  userLoggedOut,
} from '../../actions';
import {
  assignmentCreated,
  assignmentNotCreated,
} from '../../actions/assignments';
import {
  projectExportError,
  projectExportNotDisplayed,
  snapshotCreated,
  snapshotExportError,
  snapshotImportError,
  snapshotNotFound,
} from '../../actions/clients';
import {
  changeCurrentProject,
  gistImportError,
  gistNotFound,
  updateProjectSource,
} from '../../actions/projects';
import {
  closeAssignmentCreator,
  closeProjectPickerModal,
  editorFocusedRequestedLine,
  filterProjects,
  focusLine,
  hideSaveIndicator,
  notificationTriggered,
  openAssignmentCreator,
  openProjectPickerModal,
  showSaveIndicator,
  startDragColumnDivider,
  stopDragColumnDivider,
  updateNotificationMetadata,
  userDismissedNotification,
  userDoneTyping,
} from '../../actions/ui';
import {identityLinked, linkIdentityFailed} from '../../actions/user';
import {EmptyGistError} from '../../clients/github';
import {EditorLocation, Notification} from '../../records';
import reducer from '../ui';

const GIST_ID = '1234';

test('sets editing instructions', () => {
  expect(applyActions(startEditingInstructions())).toMatchObject({
    isEditingInstructions: true,
  });
});

test('cancels editing instructions', () => {
  expect(
    applyActions(startEditingInstructions(), cancelEditingInstructions()),
  ).toMatchObject({
    isEditingInstructions: false,
  });
});

test('unsets editing instructions when instructions saved', () => {
  expect(
    applyActions(startEditingInstructions(), updateProjectInstructions('')),
  ).toMatchObject({
    isEditingInstructions: false,
  });
});

test('gistNotFound notification', () => {
  expectNotification(
    applyActions(gistNotFound(GIST_ID)),
    'gist-import-not-found',
    'error',
    {gistId: GIST_ID},
  );
});

test('gistImportError notification', () => {
  expectNotification(
    applyActions(gistImportError(GIST_ID)),
    'gist-import-error',
    'error',
    {gistId: GIST_ID},
  );
});

test('change current project with project picker open', () => {
  expect(
    applyActions(
      toggleTopBarMenu('projectPicker'),
      changeCurrentProject('12345'),
    ),
  ).toMatchObject({openTopBarMenu: null});
});

test('records ongoing typing', () => {
  expect(
    applyActions(updateProjectSource('1234', 'css', '/* hi */')),
  ).toMatchObject({
    isTyping: true,
  });
});

test('records user done typing', () => {
  expect(
    applyActions(
      updateProjectSource('1234', 'css', '/* hi */'),
      userDoneTyping(),
    ),
  ).toMatchObject({
    isTyping: false,
  });
});

test('typing after snapshot creation deletes notification', () => {
  expect(
    applyActions(
      snapshotCreated('12345'),
      updateProjectSource('1234', 'css', '/* hi */'),
    ),
  ).toMatchObject({
    notifications: new Immutable.Map(),
  });
});

test('show saved indicator', () => {
  expect(applyActions(showSaveIndicator())).toMatchObject({
    isSaveIndicatorVisible: true,
  });
});

test('hide saved indicator', () => {
  expect(applyActions(showSaveIndicator(), hideSaveIndicator())).toMatchObject({
    isSaveIndicatorVisible: false,
  });
});

[
  ['log out', userLoggedOut],
  ['link GitHub identity', linkGithubIdentity],
  ['unlink GitHub identity', unlinkGithubIdentity],
].forEach(([description, createAction]) => {
  test(`${description} with user menu open`, () => {
    expect(
      applyActions(toggleTopBarMenu('currentUser'), createAction()),
    ).toMatchObject({openTopBarMenu: null});
  });

  test(`${description} with other menu open`, () => {
    expect(
      applyActions(toggleTopBarMenu('silly'), userLoggedOut()),
    ).toMatchObject({openTopBarMenu: 'silly'});
  });
});

test('identity linked', () => {
  expectNotification(
    applyActions(
      identityLinked(
        {providerData: [{providerId: 'github.com'}]},
        {providerId: 'github.com'},
      ),
    ),
    'identity-linked',
    'notice',
    {provider: 'github.com'},
  );
});

test('identity failed to link', () => {
  expectNotification(
    applyActions(linkIdentityFailed(new Error())),
    'link-identity-failed',
    'error',
  );
});

test('project export not displayed', () => {
  const url = 'https://gists.github.com/12345abc';
  const exportType = 'gist';
  expectNotification(
    applyActions(projectExportNotDisplayed(url, exportType)),
    'project-export-complete',
    'notice',
    {url, exportType},
  );
});

test('generic project export error', () => {
  expectNotification(
    applyActions(projectExportError('gist')),
    'gist-export-error',
    'error',
    {exportType: 'gist'},
  );
});

test('empty gist project export error', () => {
  expectNotification(
    applyActions(projectExportError(new EmptyGistError())),
    'empty-gist',
    'error',
  );
});

test('snapshot created', () => {
  const snapshotKey = '12345';
  expectNotification(
    applyActions(snapshotCreated(snapshotKey)),
    'snapshot-created',
    'notice',
    {snapshotKey},
  );
});

test('snapshot export error', () => {
  expectNotification(
    applyActions(snapshotExportError(new Error())),
    'snapshot-export-error',
    'error',
  );
});

test('snapshot import error', () => {
  expectNotification(
    applyActions(snapshotImportError(new Error())),
    'snapshot-import-error',
    'error',
  );
});

test('snapshot not found', () => {
  expectNotification(
    applyActions(snapshotNotFound()),
    'snapshot-not-found',
    'error',
  );
});

test('focus line', () => {
  const component = 'editor.javascript';
  const line = 4;
  const column = 2;
  expect(applyActions(focusLine(component, line, column))).toMatchObject({
    requestedFocusedLine: new EditorLocation({
      component: 'editor.javascript',
      line: 4,
      column: 2,
    }),
  });
});

test('clear console entries', () => {
  expect(applyActions(clearConsoleEntries())).toMatchObject({
    requestedFocusedLine: new EditorLocation({
      component: 'console',
      line: 0,
      column: 0,
    }),
  });
});

test('editor focused requested line', () => {
  expect(
    applyActions(
      focusLine('editor.javascript', 4, 2),
      editorFocusedRequestedLine(),
    ),
  ).toMatchObject({
    requestedFocusedLine: null,
  });
});

test('notification triggered with no metadata', () => {
  expectNotification(
    applyActions(notificationTriggered('some-error', 'error')),
    'some-error',
    'error',
  );
});

test('notification triggered with metadata', () => {
  expectNotification(
    applyActions(notificationTriggered('some-error', 'error', {goofy: true})),
    'some-error',
    'error',
    {goofy: true},
  );
});

test('update notification metadata', () => {
  expectNotification(
    applyActions(
      notificationTriggered('some-error', 'error', {goofy: true}),
      updateNotificationMetadata('some-error', {silliness: 11}),
    ),
    'some-error',
    'error',
    {goofy: true, silliness: 11},
  );
});

test('user dismissed notification', () => {
  const type = 'some-error';
  expect(
    applyActions(
      notificationTriggered(type, 'error'),
      userDismissedNotification(type),
    ),
  ).toMatchObject({notifications: new Immutable.Map()});
});

test('application loaded in experimental mode', () => {
  expect(
    applyActions(applicationLoaded({isExperimental: true})),
  ).toMatchObject({isExperimental: true});
});

test('application loaded in GA mode', () => {
  expect(applyActions(applicationLoaded({}))).toMatchObject({
    isExperimental: false,
  });
});

test('project compilation failed', () => {
  expectNotification(
    applyActions(projectCompilationFailed(new Error())),
    'project-compilation-failed',
    'error',
  );
});

test('project compiled', () => {
  expect(
    applyActions(
      projectCompilationFailed(new Error()),
      projectCompiled('<html></html>'),
    ),
  ).toMatchObject({
    notifications: new Immutable.Map(),
  });
});

test('toggle top bar menu opens when nothing open', () => {
  expect(applyActions(toggleTopBarMenu('silly'))).toMatchObject({
    openTopBarMenu: 'silly',
  });
});

test('toggle top bar menu closed when specified menu is open', () => {
  expect(
    applyActions(toggleTopBarMenu('silly'), toggleTopBarMenu('silly')),
  ).toMatchObject({openTopBarMenu: null});
});

test('toggle top bar menu opens when different menu is open', () => {
  expect(
    applyActions(toggleTopBarMenu('goofy'), toggleTopBarMenu('silly')),
  ).toMatchObject({openTopBarMenu: 'silly'});
});

test('open assignment creator', () => {
  expect(applyActions(openAssignmentCreator())).toMatchObject({
    isAssignmentCreatorOpen: true,
  });
});

test('close assignment creator', () => {
  expect(
    applyActions(openAssignmentCreator(), closeAssignmentCreator()),
  ).toMatchObject({
    isAssignmentCreatorOpen: false,
  });
});

test('assignment created', () => {
  const state = applyActions(openAssignmentCreator(), assignmentCreated({}));
  expectNotification(state, 'project-export-complete', 'notice');
  expect(state).toMatchObject({isAssignmentCreatorOpen: false});
});

test('assignment not created', () => {
  const state = applyActions(openAssignmentCreator(), assignmentNotCreated({}));
  expectNotification(state, 'assignment-not-created', 'error');
  expect(state).toMatchObject({isAssignmentCreatorOpen: false});
});

test('start dragging column divider', () => {
  expect(applyActions(startDragColumnDivider())).toMatchObject({
    isDraggingColumnDivider: true,
  });
});

test('finish dragging column divider', () => {
  expect(
    applyActions(startDragColumnDivider(), stopDragColumnDivider()),
  ).toMatchObject({
    isDraggingColumnDivider: false,
  });
});

test('openProjectPickerModal opens project picker modal', () => {
  expect(applyActions(openProjectPickerModal())).toMatchObject({
    isProjectPickerModalOpen: true,
  });
});

test('closeProjectPickerModal closes project picker modal', () => {
  applyActions(openProjectPickerModal());
  expect(applyActions(closeProjectPickerModal())).toMatchObject({
    isProjectPickerModalOpen: false,
  });
});

describe('filterProjects filters', () => {
  it('active projects', () => {
    applyActions(filterProjects('archived'));
    expect(applyActions(filterProjects('active'))).toMatchObject({
      projectsFilter: 'active',
    });
  });

  it('archived projects', () => {
    expect(applyActions(filterProjects('archived'))).toMatchObject({
      projectsFilter: 'archived',
    });
  });
});

function applyActions(...actions) {
  return reduce(actions, (state, action) => reducer(state, action), undefined);
}

function expectNotification(state, type, severity, metadata) {
  expect(state.getIn(['notifications', type])).toEqualImmutable(
    new Notification({
      type,
      severity,
      metadata: new Immutable.Map(metadata),
    }),
  );
}
