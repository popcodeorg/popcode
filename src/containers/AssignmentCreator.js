import {connect} from 'react-redux';

import {closeAssignmentCreator, createAssignment} from '../actions';
import AssignmentCreator from '../components/AssignmentCreator';
import {AssignmentState} from '../enums';

import {
  getCourses,
  getCurrentProjectPreview,
  getParsedDate,
  isAssignmentCreatorOpen,
  isAssignmentExportInProgress,
  makeIsRemoteCollectionFullyLoaded,
} from '../selectors';

const areCoursesLoaded = makeIsRemoteCollectionFullyLoaded([
  'googleClassroom',
  'courses',
]);

function mapStateToProps(state) {
  return {
    courses: getCourses(state),
    areCoursesLoaded: areCoursesLoaded(state),
    isAssignmentExportInProgress: isAssignmentExportInProgress(state),
    isOpen: isAssignmentCreatorOpen(state),
    projectTitle: getCurrentProjectPreview(state),
    parsedDate: getParsedDate(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onAssignAssignment(data) {
      const selectedCourseId = data.get('course');
      const dueDate = data.get('date').parsedDate;
      dispatch(
        createAssignment(selectedCourseId, dueDate, AssignmentState.PUBLISHED),
      );
    },

    onDraftAssignment(data) {
      const selectedCourseId = data.get('course');
      const dueDate = data.get('date').parsedDate;
      dispatch(
        createAssignment(selectedCourseId, dueDate, AssignmentState.DRAFT),
      );
    },

    onCloseAssignmentCreator() {
      dispatch(closeAssignmentCreator());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AssignmentCreator);
