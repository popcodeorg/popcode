import classnames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import map from 'lodash/map';
import partial from 'lodash/partial';

function AssignmentSelector({
  courses,
  currentProjectKey,
  dateInput,
  isOpen,
  parsedDate,
  selectedCourse,
  onAssignAssignment,
  onCloseAssignmentSelector,
  onDraftAssignment,
  onHandleDateInput,
  onSelectCourse,
}) {
  if (!isOpen) {
    return null;
  }
  const courseOptions = map(courses, course => (
    <option key={course.id} value={course.id}>{course.name}</option>
  ));
  let parsedDateString;
  if (parsedDate) {
    parsedDateString = parsedDate.toLocaleTimeString(
      'en-EN',
      {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'},
    );
  }

  return (
    <div className="modal">
      <div className="modal__contents">
        <div className="assignment-selector">
          <h1 className="assignment-selector__title">
            Google Classroom
          </h1>
          <div className="assignment-selector__select-field">
            <select
              className="assignment-selector__select"
              value={selectedCourse}
              onChange={onSelectCourse}
            >
              <option value=""> Select Class </option>
              {courseOptions}
            </select>
            <span className="u__icon assignment-selector__caret">
              &#xf0d7;
            </span>
          </div>
          <div className="assignment-selector__input_field">
            <input
              className="assignment-selector__input"
              placeholder="when is it due?"
              type="text"
              value={dateInput}
              onChange={onHandleDateInput}
            />
          </div>
          <p className="assignment-selector__parsed_date">
            {parsedDateString}
          </p>
          <button
            className={classnames(
              'assignment-selector__button',
              'assignment-selector__button_reject',
            )}
            type="button"
            onClick={onCloseAssignmentSelector}
          >
            Cancel
          </button>
          <button
            className={classnames(
              'assignment-selector__button',
              'assignment-selector__button_confirm',
            )}
            type="button"
            onClick={partial(onDraftAssignment,
              currentProjectKey,
              selectedCourse,
              parsedDate,
            )}
          >
            Draft
          </button>
          <button
            className={classnames(
              'assignment-selector__button',
              'assignment-selector__button_confirm',
            )}
            type="button"
            onClick={partial(onAssignAssignment,
              currentProjectKey,
              selectedCourse,
              parsedDate,
            )}
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
  currentProjectKey: PropTypes.string,
  dateInput: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  parsedDate: PropTypes.object,
  selectedCourse: PropTypes.string.isRequired,
  onAssignAssignment: PropTypes.func.isRequired,
  onCloseAssignmentSelector: PropTypes.func.isRequired,
  onDraftAssignment: PropTypes.func.isRequired,
  onHandleDateInput: PropTypes.func.isRequired,
  onSelectCourse: PropTypes.func.isRequired,
};

AssignmentSelector.defaultProps = {
  parsedDate: null,
  currentProjectKey: null,
};

export default AssignmentSelector;
