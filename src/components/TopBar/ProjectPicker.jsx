import map from 'lodash/map';
import PropTypes from 'prop-types';
import ProjectPreview from '../../containers/ProjectPreview';
import ProjectPickerButton from './ProjectPickerButton';
import createMenu from './createMenu';

const ProjectPicker = createMenu({
  name: 'projectPicker',

  isVisible({currentProjectKey, projectKeys}) {
    return currentProjectKey && projectKeys.length > 1;
  },

  mapPropsToItems({currentProjectKey, projectKeys}) {
    return map(projectKeys, projectKey => ({
      key: projectKey,
      isEnabled: projectKey === currentProjectKey,
      props: {projectKey},
    }));
  },
})(ProjectPickerButton, ProjectPreview);

ProjectPicker.propTypes = {
  currentProjectKey: PropTypes.string,
  projectKeys: PropTypes.arrayOf(PropTypes.string).isRequired,
};

ProjectPicker.defaultProps = {
  currentProjectKey: null,
};

export default ProjectPicker;
