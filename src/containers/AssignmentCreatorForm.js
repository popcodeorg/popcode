import {reduxForm} from 'redux-form/immutable';
import {t} from 'i18next';
import isEmpty from 'lodash-es/isEmpty';
import isNil from 'lodash-es/isNil';
import get from 'lodash-es/get';

import AssignmentCreatorFormComponent from '../components/AssignmentCreatorForm';

function validate(values) {
  const errors = {};
  const course = values.get('course');
  const date = values.get('date');

  if (isEmpty(course)) {
    errors.course = t('assignment-creator.no-class-selected');
  }
  if (isNil(get(date, 'parsedDate'))) {
    errors.date = t('assignment-creator.date-not-valid');
  } else if (date.parsedDate < Date.now()) {
    errors.date = t('assignment-creator.past-date-not-valid');
  }
  return errors;
}

const AssignmentCreatorForm = reduxForm({
  form: 'assignmentCreator',
  validate,
})(AssignmentCreatorFormComponent);

export default AssignmentCreatorForm;
