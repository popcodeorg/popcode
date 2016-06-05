import React from 'react';
import map from 'lodash/map';
import partial from 'lodash/partial';
import i18n from 'i18next-client';
import ErrorItem from './ErrorItem';

function ErrorSublist(props) {
  if (props.errors.length === 0) {
    return false;
  }

  const errors = map(props.errors, (error) => (
    <ErrorItem
      {...error}
      key={[error.reason, error.row]}
      onClick={partial(
        props.onErrorClicked,
        props.language
      )}
    />
  ));

  const errorMessage = i18n.t(
    'errors.notice',
    {amount: props.errors.length, language: props.language}
  );

  return (
    <div className="errorList-errorSublist">
      <h2 className="errorList-errorSublist-header">
        {errorMessage}
      </h2>
      <ul className="errorList-errorSublist-list">
        {errors}
      </ul>
    </div>
  );
}

ErrorSublist.propTypes = {
  errors: React.PropTypes.array.isRequired,
  language: React.PropTypes.oneOf(['html', 'css', 'javascript']).isRequired,
  onErrorClicked: React.PropTypes.func.isRequired,
};

export default ErrorSublist;
