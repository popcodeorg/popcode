import {connect} from 'react-redux';
import {
  courseWorkSelectorClosed,
  courseSelected,
} from '../actions/ui';
import {
  createCourseWork,
} from '../actions/clients';
import {
  getCourses,
  isCourseWorkSelectorOpen,
  getSelectedCourse,
} from '../selectors';
import CourseWorkSelector from '../components/CourseWorkSelector';


function makeMapStateToProps() {
  return function mapStateToProps(state) {
    return {
      courses: getCourses(state),
      isOpen: isCourseWorkSelectorOpen(state),
      selectedCourse: getSelectedCourse(state),
    };
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onCreateAssignment(selectedCourse) {
      dispatch(createCourseWork('ASSIGNMENT', selectedCourse));
    },

    onSelectCourse(e) {
      dispatch(courseSelected(e.target.value));
    },

    onCloseCourseWorkSelector() {
      dispatch(courseWorkSelectorClosed());
    },
  };
}

export default connect(
  makeMapStateToProps,
  mapDispatchToProps,
)(CourseWorkSelector);
