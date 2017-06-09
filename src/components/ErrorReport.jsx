import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import ErrorList from './ErrorList';

function ErrorReport({docked, errors: {html, css, javascript}, onErrorClick}) {
  return (
    <div
      className={classnames(
        'error-list',
        'output__item',
        {'error-list_docked': docked, output__item_shrink: docked},
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
  docked: PropTypes.bool,
  errors: PropTypes.shape({
    css: PropTypes.object.isRequired,
    html: PropTypes.object.isRequired,
    javascript: PropTypes.object.isRequired,
  }).isRequired,
  onErrorClick: PropTypes.func.isRequired,
};

ErrorReport.defaultProps = {
  docked: false,
};

export default ErrorReport;
