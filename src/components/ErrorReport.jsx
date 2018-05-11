import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import find from 'lodash-es/find';
import ErrorList from './ErrorList';
import PopThrobber from './PopThrobber';

function ErrorReport({errors, isValidating, onErrorClick}) {
  if (isValidating) {
    return (
      <div className="output__delayed-error-overlay">
        <PopThrobber />
      </div>
    );
  }

  const hasErrors = Boolean(find(errors, list => list.items.length));
  if (!hasErrors) {
    return null;
  }

  const isDocked = Boolean(find(errors, {state: 'runtime-error'}));
  const {html, css, javascript} = errors;

  return (
    <div
      className={classnames(
        'error-list',
        'output__item',
        {'error-list_docked': isDocked, output__item_shrink: isDocked},
      )}
    >
      <ErrorList
        errors={html}
        language="html"
        onErrorClick={onErrorClick}
      />
      <ErrorList
        errors={css}
        language="css"
        onErrorClick={onErrorClick}
      />
      <ErrorList
        errors={javascript}
        language="javascript"
        onErrorClick={onErrorClick}
      />
    </div>
  );
}

ErrorReport.propTypes = {
  errors: PropTypes.shape({
    css: PropTypes.object.isRequired,
    html: PropTypes.object.isRequired,
    javascript: PropTypes.object.isRequired,
  }).isRequired,
  isValidating: PropTypes.bool.isRequired,
  onErrorClick: PropTypes.func.isRequired,
};

export default ErrorReport;
