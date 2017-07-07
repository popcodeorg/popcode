import {createSelector} from 'reselect';

export default createSelector(
  state => state.get('errors'),
  (errors) => {
    const errorStates =
      errors.map(errorList => errorList.get('state'));

    if (errorStates.includes('validation-error')) {
      return 'validation-error';
    }

    if (errorStates.includes('validating')) {
      return 'validating';
    }

    if (errorStates.includes('runtime-error')) {
      return 'runtime-error';
    }

    return 'passed';
  },
);
