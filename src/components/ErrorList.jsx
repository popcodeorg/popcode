import React from 'react';
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
  css: React.PropTypes.object.isRequired,
  docked: React.PropTypes.bool,
  html: React.PropTypes.object.isRequired,
  javascript: React.PropTypes.object.isRequired,
  onErrorClick: React.PropTypes.func.isRequired,
};

ErrorList.defaultProps = {
  docked: false,
};

export default ErrorList;
