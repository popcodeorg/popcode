import map from 'lodash/map';
import partial from 'lodash/partial';
import PropTypes from 'prop-types';
import React from 'react';
import ProjectPreview from '../../containers/ProjectPreview';
import ProjectPickerButton from './ProjectPickerButton';
import createMenu, {MenuItem} from './createMenu';

const ProjectPicker = createMenu({
  name: 'projectPicker',

  isVisible({currentProjectKey, projectKeys}) {
    return currentProjectKey && projectKeys.length > 1;
  },

  renderItems({currentProjectKey, projectKeys, onChangeCurrentProject}) {
    return map(projectKeys, projectKey => (
      <MenuItem
        isEnabled={projectKey === currentProjectKey}
        key={projectKey}
        onClick={partial(onChangeCurrentProject, projectKey)}
      >
        <ProjectPreview projectKey={projectKey} />
      </MenuItem>
    ));
  },
})(ProjectPickerButton);

ProjectPicker.propTypes = {
  currentProjectKey: PropTypes.string,
  projectKeys: PropTypes.arrayOf(PropTypes.string).isRequired,
};

ProjectPicker.defaultProps = {
  currentProjectKey: null,
};

export default ProjectPicker;
