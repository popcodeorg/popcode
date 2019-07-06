import {createSelector} from 'reselect';

export default createSelector(
  state => state.get('errors'),
  errors => {
    const errorStates = [
      errors.html.state,
      errors.css.state,
      errors.javascript.state,
    ];

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
