import classnames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import map from 'lodash/map';
import partial from 'lodash/partial';


function AssignmentSelector({
  courses,
  currentProjectKey,
  isOpen,
  selectedCourse,
  selectedDate,
  onCreateAssignment,
  onCloseAssignmentSelector,
  onSelectCourse,
  onSelectDate,
}) {
  if (!isOpen) {
    return null;
  }
  const courseOptions = map(courses, course => (
    <option key={course.id} value={course.id}>{course.name}</option>
  ));

  return (
    <div className="modal">
      <div className="modal__contents">
        <div className="course-work-selector">
          <h1 className="course-work-selector__title">
            Google Classroom
          </h1>
          <p> Select Your Class: </p>
          <select
            value={selectedCourse}
            onChange={onSelectCourse}
          >
            <option value=""> Select Class </option>
            {courseOptions}
          </select>
          <p> Due Date: </p>
          <input type="date" value={selectedDate} onChange={onSelectDate} />
          <p> Action </p>
          <button
            className={classnames(
              'course-work-selector__button',
              'course-work-selector__button_reject',
            )}
            type="button"
            onClick={onCloseAssignmentSelector}
          >
            Cancel
          </button>
          <button
            className={classnames(
              'course-work-selector__button',
              'course-work-selector__button_confirm',
            )}
            type="button"
            onClick={partial(onCreateAssignment, currentProjectKey, selectedCourse, selectedDate)}
          >
            Assign
          </button>
        </div>
      </div>
    </div>
  );
}

AssignmentSelector.propTypes = {
  courses: PropTypes.array.isRequired,
  currentProjectKey: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  selectedCourse: PropTypes.string.isRequired,
  selectedDate: PropTypes.string.isRequired,
  onCloseAssignmentSelector: PropTypes.func.isRequired,
  onCreateAssignment: PropTypes.func.isRequired,
  onSelectCourse: PropTypes.func.isRequired,
  onSelectDate: PropTypes.func.isRequired,
};

export default AssignmentSelector;
