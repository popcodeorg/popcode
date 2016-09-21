import React from 'react';
import i18n from 'i18next-client';
import partial from 'lodash/partial';

export default function ApplicationErrors(props) {
  if (!props.errors.length) {
    return null;
  }

  const errorList = props.errors.map((error) => (
    <div className="applicationErrors-error" key={error}>
      {i18n.t(`applicationErrors.${error}`)}
      <span
        className="applicationErrors-error-dismiss"
        onClick={partial(props.onErrorDismissed, error)}
      >&#xf00d;</span>
    </div>
  ));

  return (
    <div className="applicationErrors">{errorList}</div>
  );
}

ApplicationErrors.propTypes = {
  errors: React.PropTypes.array,
  onErrorDismissed: React.PropTypes.func,
};
