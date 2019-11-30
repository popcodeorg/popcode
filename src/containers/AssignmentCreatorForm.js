import {reduxForm} from 'redux-form/immutable';
import i18next from 'i18next';
import isEmpty from 'lodash-es/isEmpty';
import isNil from 'lodash-es/isNil';

import AssignmentCreatorFormComponent from '../components/AssignmentCreatorForm';

function validate(values) {
  const errors = {};
  const course = values.get('course');
  const date = values.get('date');

  if (isEmpty(course)) {
    errors.course = i18next.t('assignment-creator.no-class-selected');
  }
  if (isNil(date?.parsedDate)) {
    errors.date = i18next.t('assignment-creator.date-not-valid');
  } else if (date.parsedDate < Date.now()) {
    errors.date = i18next.t('assignment-creator.past-date-not-valid');
  }
  return errors;
}

const AssignmentCreatorForm = reduxForm({
  form: 'assignmentCreator',
  validate,
})(AssignmentCreatorFormComponent);

export default AssignmentCreatorForm;
