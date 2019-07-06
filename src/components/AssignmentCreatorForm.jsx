import React from 'react';
import {t} from 'i18next';
import classnames from 'classnames';
import chrono from 'chrono-node';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {Field} from 'redux-form/immutable';

import FormDate from '../records/FormDate';

import AssignmentCreatorTextField from './AssignmentCreatorTextField';
import AssignmentCreatorSelectField from './AssignmentCreatorSelectField';

function parseDate(value) {
  const [parsedResponse] = chrono.parse(value);
  let parsedDate;
  if (parsedResponse) {
    parsedDate = parsedResponse.start.date();
  }
  return new FormDate({
    string: value,
    parsedDate,
  });
}

function formatDate(value) {
  if (value) {
    return value.string;
  }
  return '';
}

export default function AssignmentCreatorForm({
  courses,
  handleSubmit,
  isAssignmentExportInProgress,
  parsedDate,
  onAssignAssignment,
  onDraftAssignment,
  onCloseAssignmentCreator,
}) {
  return (
    <form>
      <div>
        <Field component={AssignmentCreatorSelectField} name="course">
          <option value="">{t('assignment-creator.select-class')}</option>
          {courses
            .map(course => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))
            .valueSeq()}
        </Field>
      </div>
      <div>
        <Field
          component={AssignmentCreatorTextField}
          format={formatDate}
          name="date"
          parse={parseDate}
          placeholder={t('assignment-creator.input-placeholder')}
          type="text"
          valueLabel={parsedDate}
        />
      </div>
      <div>
        {isAssignmentExportInProgress ? (
          <button
            disabled
            className={classnames(
              'assignment-creator__button',
              'assignment-creator__button_disabled',
            )}
            type="button"
          >
            {t('assignment-creator.creating')}
          </button>
        ) : (
          <>
            <button
              className={classnames(
                'assignment-creator__button',
                'assignment-creator__button_reject',
              )}
              type="button"
              onClick={onCloseAssignmentCreator}
            >
              {t('assignment-creator.cancel-button')}
            </button>
            <button
              className={classnames(
                'assignment-creator__button',
                'assignment-creator__button_confirm',
              )}
              type="button"
              onClick={handleSubmit(onDraftAssignment)}
            >
              {t('assignment-creator.draft-button')}
            </button>
            <button
              className={classnames(
                'assignment-creator__button',
                'assignment-creator__button_confirm',
              )}
              type="button"
              onClick={handleSubmit(onAssignAssignment)}
            >
              {t('assignment-creator.assign-button')}
            </button>
          </>
        )}
      </div>
    </form>
  );
}

AssignmentCreatorForm.propTypes = {
  courses: ImmutablePropTypes.iterable.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isAssignmentExportInProgress: PropTypes.bool.isRequired,
  parsedDate: PropTypes.instanceOf(Date),
  onAssignAssignment: PropTypes.func.isRequired,
  onCloseAssignmentCreator: PropTypes.func.isRequired,
  onDraftAssignment: PropTypes.func.isRequired,
};

AssignmentCreatorForm.defaultProps = {
  parsedDate: null,
};
