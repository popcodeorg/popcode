import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import ErrorSublist from './ErrorSublist';

function ErrorList(props) {
  return (
    <div
      className={classnames(
        'error-list',
        'output__item',
        {'error-list_docked': props.docked, output__item_shrink: props.docked},
      )}
    >
      <ErrorSublist
        errors={props.html}
        language="html"
        onErrorClick={props.onErrorClick}
      />
      <ErrorSublist
        errors={props.css}
        language="css"
        onErrorClick={props.onErrorClick}
      />
      <ErrorSublist
        errors={props.javascript}
        language="javascript"
        onErrorClick={props.onErrorClick}
      />
    </div>
  );
}

ErrorList.propTypes = {
  css: PropTypes.object.isRequired,
  docked: PropTypes.bool,
  html: PropTypes.object.isRequired,
  javascript: PropTypes.object.isRequired,
  onErrorClick: PropTypes.func.isRequired,
};

ErrorList.defaultProps = {
  docked: false,
};

export default ErrorList;
