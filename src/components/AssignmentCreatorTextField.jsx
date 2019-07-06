import {t} from 'i18next';
import React from 'react';
import PropTypes from 'prop-types';

export default function AssignmentCreatorTextField({
  input,
  placeholder,
  valueLabel,
  meta: {touched, error},
}) {
  return (
    <div>
      <div className="assignment-creator__input_field">
        <input
          className="assignment-creator__input"
          {...input}
          placeholder={placeholder}
        />
      </div>
      <div className="assignment-creator__input_warning">
        <span>{t('assignment-creator.value-label', {valueLabel})}</span>
      </div>
      <div>
        {touched && error && (
          <span className="assignment-creator__assignment-notification">
            {error}
          </span>
        )}
      </div>
    </div>
  );
}

AssignmentCreatorTextField.propTypes = {
  input: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
  placeholder: PropTypes.string.isRequired,
  valueLabel: PropTypes.instanceOf(Date),
};

AssignmentCreatorTextField.defaultProps = {
  valueLabel: null,
};
