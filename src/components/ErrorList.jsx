import React from 'react';
import PropTypes from 'prop-types';
import map from 'lodash-es/map';
import partial from 'lodash-es/partial';
import {t} from 'i18next';

import ErrorItem from './ErrorItem';

function ErrorList({errors, onErrorClick, language}) {
  if (errors.state === 'passed') {
    return false;
  }

  const errorItems = map(errors.items, error => (
    <ErrorItem
      {...error}
      key={[error.reason, error.row]}
      onClick={partial(
        onErrorClick,
        language,
      )}
    />
  ));

  const errorMessage = t(
    'errors.notice',
    {count: errors.items.length, language},
  );

  return (
    <div>
      <h2 className="error-list__header">
        {errorMessage}
      </h2>
      <ul className="error-list__errors">
        {errorItems}
      </ul>
    </div>
  );
}

ErrorList.propTypes = {
  errors: PropTypes.object.isRequired,
  language: PropTypes.oneOf(['html', 'css', 'javascript']).isRequired,
  onErrorClick: PropTypes.func.isRequired,
};

export default ErrorList;
