import React from 'react';
import classnames from 'classnames';
import get from 'lodash/get';
import ErrorSublist from './ErrorSublist';

function ErrorList(props) {
  const docked = get(props, 'docked', false);

  return (
    <div
      className={classnames(
        'errorList',
        'output-item',
        {'errorList--docked': docked, 'output-item--shrink': docked}
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

export default ErrorList;
