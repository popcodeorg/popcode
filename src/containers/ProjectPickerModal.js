import {connect} from 'react-redux';

import {closeProjectPickerModal, filterProjects} from '../actions';

import {
  getPartitionedProjects,
  isProjectPickerModalOpen,
  getProjectsFilter,
} from '../selectors';

import ProjectPickerModal from '../components/ProjectPickerModal';

function mapStateToProps(state) {
  const [activeProjects, archivedProjects] = getPartitionedProjects(state);
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
