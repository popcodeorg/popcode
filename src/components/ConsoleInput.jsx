import React, {lazy, Suspense} from 'react';
import PropTypes from 'prop-types';

import AceConsoleInput from './AceConsoleInput';

const CodeMirrorConsoleInput = lazy(() =>
  import(
    /* webpackChunkName: "experimentalOnly" */
    './CodeMirrorConsoleInput'
  ),
);

export default function ConsoleInput({isExperimental, ...props}) {
  if (isExperimental) {
    return (
      <Suspense>
        <CodeMirrorConsoleInput {...props} />
      </Suspense>
    );
  }
  return <AceConsoleInput {...props} />;
}

ConsoleInput.propTypes = {
  isExperimental: PropTypes.bool.isRequired,
};
