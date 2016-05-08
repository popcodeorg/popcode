import React from 'react';
import classnames from 'classnames';
import get from 'lodash/get';
import ErrorSublist from './ErrorSublist';

function ErrorList(props) {
  const docked = get(this, 'props.docked', false);

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
        onErrorClicked={props.onErrorClicked}
      />
      <ErrorSublist
        errors={props.css}
        language="css"
        onErrorClicked={props.onErrorClicked}
      />
      <ErrorSublist
        errors={props.javascript}
        language="javascript"
        onErrorClicked={props.onErrorClicked}
      />
    </div>
  );
}

ErrorList.propTypes = {
  css: React.PropTypes.array.isRequired,
  docked: React.PropTypes.bool,
  html: React.PropTypes.array.isRequired,
  javascript: React.PropTypes.array.isRequired,
  onErrorClicked: React.PropTypes.func.isRequired,
};

export default ErrorList;
