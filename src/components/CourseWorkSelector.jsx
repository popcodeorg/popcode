import classnames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import map from 'lodash/map';
import partial from 'lodash/partial';


function CourseWorkSelector({
  courses,
  isOpen,
  selectedCourse,
  onCreateAssignment,
  onCloseCourseWorkSelector,
  onSelectCourse,
}) {
  if (!isOpen) {
    return null;
  }
  const courseOptions = map(courses, course => (
    <option key={course.id} value={course.id}>{course.name}</option>
  ));
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="modal">
      <div className="modal__contents">
        <div className="course-work-selector">
          <h1 className="course-work-selector__title">
            Google Classroom
          </h1>
          <p> Select Your Class: </p>
          <select
            id="dropdown"
            value={selectedCourse}
            onChange={onSelectCourse}
          >
            {courseOptions}
          </select>
          <p> Due Date: </p>
          <input defaultValue={today} id="date" type="date" />
          <p> Action </p>
          <button
            className={classnames(
              'course-work-selector__button',
              'course-work-selector__button_reject',
            )}
            type="button"
            onClick={onCloseCourseWorkSelector}
          >
            Cancel
          </button>
          <button
            className={classnames(
              'course-work-selector__button',
              'course-work-selector__button_confirm',
            )}
            type="button"
            onClick={partial(onCreateAssignment, selectedCourse)}
          >
            Assign
          </button>
        </div>
      </div>
    </div>
  );
}

CourseWorkSelector.propTypes = {
  courses: PropTypes.array.isRequired,
  isOpen: PropTypes.bool.isRequired,
  selectedCourse: PropTypes.string.isRequired,
  onCloseCourseWorkSelector: PropTypes.func.isRequired,
  onCreateAssignment: PropTypes.func.isRequired,
  onSelectCourse: PropTypes.func.isRequired,
};

export default CourseWorkSelector;
