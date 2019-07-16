import {connect} from 'react-redux';

import {closeProjectPickerModal, filterProjects} from '../actions';

import {
  getAllProjects,
  isProjectPickerModalOpen,
  getProjectsFilter,
} from '../selectors';

import ProjectPickerModal from '../components/ProjectPickerModal';

function mapStateToProps(state) {
  return {
    isOpen: isProjectPickerModalOpen(state),
    projects: getAllProjects(state),
    projectsFilter: getProjectsFilter(state),
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProjectPickerModal);
