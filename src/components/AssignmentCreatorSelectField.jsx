import React from 'react';
import PropTypes from 'prop-types';

import {faCaretDown} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

export default function AssignmentCreatorSelectField({
  children,
  input,
  meta: {touched, error},
}) {
  return (
    <div>
      <div className="assignment-creator__select-field">
        <select className="assignment-creator__select" {...input}>
          {children}
        </select>
        <span className="assignment-creator__caret">
          <FontAwesomeIcon icon={faCaretDown} />
        </span>
      </div>
      {touched && error && (
        <span className="assignment-creator__assignment-notification">
          {error}
        </span>
      )}
    </div>
  );
}

AssignmentCreatorSelectField.propTypes = {
  children: PropTypes.array.isRequired,
  input: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
};
