import React from 'react';
import PropTypes from 'prop-types';

import ErrorReport from '../containers/ErrorReport';
import Preview from '../containers/Preview';
import Console from '../containers/Console';

export default function Output({children}) {
  return (
    <div className="output">
      <Preview />
      <Console />
      <ErrorReport />
      {children}
    </div>
  );
}

Output.propTypes = {
  children: PropTypes.node,
};

Output.defaultProps = {
  children: [],
};
