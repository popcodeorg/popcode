import classnames from 'classnames';
import i18next from 'i18next';
import filter from 'lodash-es/filter';
import isEmpty from 'lodash-es/isEmpty';
import map from 'lodash-es/map';
import partial from 'lodash-es/partial';
import some from 'lodash-es/some';
import PropTypes from 'prop-types';
import React from 'react';

import ProjectPreview from '../../containers/ProjectPreview';

import createMenu, {MenuItem} from './createMenu';
import ProjectPickerButton from './ProjectPickerButton';

const ProjectPicker = createMenu({
  menuClass: 'top-bar__menu_right top-bar__menu_project-picker',
  name: 'projectPicker',

  isVisible({currentProjectKey, isUserAuthenticated, projectKeys}) {
    return (
      Boolean(currentProjectKey) && !isEmpty(projectKeys) && isUserAuthenticated
    );
  },

  renderItems({
    currentProjectKey,
    projects,
    shouldShowArchivedProjects,
    onChangeCurrentProject,
    onToggleViewArchived,
  }) {
    const visibleProjects = shouldShowArchivedProjects
      ? projects
      : filter(projects, ({isArchived}) => !isArchived);
    const items = map(visibleProjects, ({projectKey}) => (
      <MenuItem
        isActive={projectKey === currentProjectKey}
        key={projectKey}
        onClick={partial(onChangeCurrentProject, projectKey)}
      >
        <ProjectPreview projectKey={projectKey} />
      </MenuItem>
    ));

    if (some(projects, 'isArchived')) {
      items.push(
        <div
          className={classnames(
            'top-bar__menu-item',
            'top-bar__menu-item_toggle-archived-projects-button',
          )}
          key="toggleShowArchivedProjects"
          onClick={onToggleViewArchived}
        >
          <div>
            {shouldShowArchivedProjects
              ? i18next.t('top-bar.hide-projects')
              : i18next.t('top-bar.show-projects')}
          </div>
        </div>,
      );
    }

    return items;
  },
})(ProjectPickerButton);

ProjectPicker.propTypes = {
  currentProjectKey: PropTypes.string,
  projects: PropTypes.array.isRequired,
  shouldShowArchivedProjects: PropTypes.bool.isRequired,
  onToggleViewArchived: PropTypes.func.isRequired,
};

ProjectPicker.defaultProps = {
  currentProjectKey: null,
};

export default ProjectPicker;
