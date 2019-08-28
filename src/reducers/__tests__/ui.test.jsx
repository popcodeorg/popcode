import reduce from 'lodash-es/reduce';

import reducer from '../ui';

import {
  openProjectPickerModal,
  closeProjectPickerModal,
  filterProjects,
} from '../../actions';

test('openProjectPickerModal opens project picker modal', () => {
  const {isProjectPickerModalOpen} = applyActions(openProjectPickerModal());
  expect(isProjectPickerModalOpen).toEqual(true);
});

test('closeProjectPickerModal closes project picker modal', () => {
  applyActions(openProjectPickerModal());
  const {isProjectPickerModalOpen} = applyActions(closeProjectPickerModal());
  expect(isProjectPickerModalOpen).toEqual(false);
});

describe('filterProjects filters', () => {
  it('active projects', () => {
    applyActions(filterProjects('archived'));
    const {projectsFilter} = applyActions(filterProjects('active'));
    expect(projectsFilter).toEqual('active');
  });

  it('archived projects', () => {
    const {projectsFilter} = applyActions(filterProjects('archived'));
    expect(projectsFilter).toEqual('archived');
  });
});

function applyActions(...actions) {
  return reduce(actions, (state, action) => reducer(state, action), undefined);
}
