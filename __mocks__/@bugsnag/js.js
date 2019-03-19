import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash-es/noop';

function ErrorBoundary({children}) {
  return React.createElement(Fragment, null, children);
}
ErrorBoundary.propTypes = {children: PropTypes.node.isRequired};

export default function bugsnag() {
  return {
    use: noop,

    notify: noop,

    getPlugin(plugin) {
      if (plugin === 'react') {
        return ErrorBoundary;
      }

      throw new Error(
        `bugsnagClient.getPlugin mock called with unexpected plugin ${plugin}`,
      );
    },
  };
}
