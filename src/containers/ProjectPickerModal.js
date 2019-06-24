import {connect} from 'react-redux';

import {closeProjectPickerModal, toggleArchivedView} from '../actions';

import {
  getAllProjects,
  isProjectPickerModalOpen,
  isArchivedViewOpen,
} from '../selectors';

import ProjectPickerModal from '../components/ProjectPickerModal';

function mapStateToProps(state) {
  return {
    isOpen: isProjectPickerModalOpen(state),
    projects: getAllProjects(state),
    shouldShowArchivedProjects: isArchivedViewOpen(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onCloseProjectPickerModal() {
      dispatch(closeProjectPickerModal());
    },

    onToggleViewArchived() {
      dispatch(toggleArchivedView());
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProjectPickerModal);
