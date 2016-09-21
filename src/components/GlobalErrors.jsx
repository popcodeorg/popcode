import React from 'react';
import i18n from 'i18next-client';
import partial from 'lodash/partial';

export default function GlobalErrors(props) {
  if (!props.errors.length) {
    return null;
  }

  const errorList = props.errors.map((error) => (
    <div className="globalErrors-globalError" key={error}>
      {i18n.t(`globalErrors.${error}`)}
      <span
        className="globalErrors-globalError-dismiss"
        onClick={partial(props.onErrorDismissed, error)}
      >&#xf00d;</span>
    </div>
  ));

  return (
    <div className="globalErrors">{errorList}</div>
  );
}

GlobalErrors.propTypes = {
  errors: React.PropTypes.array,
  onErrorDismissed: React.PropTypes.func,
};
