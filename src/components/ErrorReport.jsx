import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import find from 'lodash/find';
import ErrorList from './ErrorList';

function ErrorReport({errors, onErrorClick}) {
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
  onErrorClick: PropTypes.func.isRequired,
};

export default ErrorReport;
