import {connect} from 'react-redux';
import {
  assignmentSelectorClosed,
  courseSelected,
  updateDate,
} from '../actions/ui';
import {
  assignAssignment,
  draftAssignment,
} from '../actions/assignments';
import {
  getCourses,
  getCurrentProjectKey,
  isAssignmentSelectorOpen,
  getSelectedCourse,
  getDateInput,
  getParsedDate,
} from '../selectors';
import AssignmentSelector from '../components/AssignmentSelector';


function makeMapStateToProps() {
  return function mapStateToProps(state) {
    return {
      courses: getCourses(state),
      currentProjectKey: getCurrentProjectKey(state),
      dateInput: getDateInput(state),
      isOpen: isAssignmentSelectorOpen(state),
      parsedDate: getParsedDate(state),
      selectedCourse: getSelectedCourse(state),
    };
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onAssignAssignment(projectKey, selectedCourse, parsedDate) {
      dispatch(assignAssignment(
        projectKey,
        selectedCourse,
        parsedDate,
      ));
    },

    onDraftAssignment(projectKey, selectedCourse, parsedDate) {
      dispatch(draftAssignment(
        projectKey,
        selectedCourse,
        parsedDate,
      ));
    },

    onSelectCourse(e) {
      dispatch(courseSelected(e.target.value));
    },

    onCloseAssignmentSelector() {
      dispatch(assignmentSelectorClosed());
    },

    onHandleDateInput(e) {
      dispatch(updateDate(e.target.value));
    },
  };
}

export default connect(
  makeMapStateToProps,
  mapDispatchToProps,
)(AssignmentSelector);
