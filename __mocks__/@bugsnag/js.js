import constant from 'lodash-es/constant';
import noop from 'lodash-es/noop';
import PropTypes from 'prop-types';
import React, {Fragment} from 'react';

function ErrorBoundary({children}) {
  return React.createElement(Fragment, null, children);
}
ErrorBoundary.propTypes = {children: PropTypes.node.isRequired};

export default {
  start() {
    return {
      use: noop,

      notify: noop,

      getPlugin(plugin) {
        if (plugin === 'react') {
          return {createErrorBoundary: constant(ErrorBoundary)};
        }

        throw new Error(
          `bugsnagClient.getPlugin mock called with unexpected plugin ${plugin}`,
        );
      },
    };
  },
};
