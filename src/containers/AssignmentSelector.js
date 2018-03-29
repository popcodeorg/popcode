import {connect} from 'react-redux';
import {
  assignmentSelectorClosed,
  courseSelected,
  dateSelected,
} from '../actions/ui';
import {
  createAssignment,
} from '../actions/clients';
import {
  getCourses,
  getCurrentProjectKey,
  isAssignmentSelectorOpen,
  getSelectedCourse,
  getSelectedDate,
} from '../selectors';
import AssignmentSelector from '../components/AssignmentSelector';


function makeMapStateToProps() {
  return function mapStateToProps(state) {
    return {
      courses: getCourses(state),
      currentProjectKey: getCurrentProjectKey(state),
      isOpen: isAssignmentSelectorOpen(state),
      selectedCourse: getSelectedCourse(state),
      selectedDate: getSelectedDate(state),
    };
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onCreateAssignment(projectKey, selectedCourse, selectedDate) {
      dispatch(createAssignment('ASSIGNMENT', projectKey, selectedCourse, selectedDate));
    },

    onSelectCourse(e) {
      dispatch(courseSelected(e.target.value));
    },

    onSelectDate(e) {
      dispatch(dateSelected(e.target.value));
    },

    onCloseAssignmentSelector() {
      dispatch(assignmentSelectorClosed());
    },
  };
}

export default connect(
  makeMapStateToProps,
  mapDispatchToProps,
)(AssignmentSelector);
