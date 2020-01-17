import {connect} from 'react-redux';

import {closeProjectPickerModal, filterProjects} from '../actions';

import ProjectPickerModal from '../components/ProjectPickerModal';

import {
  getPartitionedProjects,
  getProjectsFilter,
  isProjectPickerModalOpen,
} from '../selectors';

function mapStateToProps(state) {
  const [archivedProjects, activeProjects] = getPartitionedProjects(state);
  return {
    isOpen: isProjectPickerModalOpen(state),
    projectsFilter: getProjectsFilter(state),
    activeProjects,
    archivedProjects,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onCloseProjectPickerModal() {
      dispatch(closeProjectPickerModal());
    },

    onFilterProjects(filterType) {
      dispatch(filterProjects(filterType));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectPickerModal);
