import PropTypes from 'prop-types';
import React, {lazy, Suspense} from 'react';

const AceConsoleInput = lazy(() =>
  import(
    /* webpackChunkName: "editor-ace" */
    './AceConsoleInput'
  ),
);

const CodeMirrorConsoleInput = lazy(() =>
  import(
    /* webpackChunkName: "editor-codemirror" */
    './CodeMirrorConsoleInput'
  ),
);

export default function ConsoleInput({useCodeMirror, ...props}) {
  return (
    <Suspense>
      {useCodeMirror ? (
        <CodeMirrorConsoleInput {...props} />
      ) : (
        <AceConsoleInput {...props} />
      )}
    </Suspense>
  );
}

ConsoleInput.propTypes = {
  useCodeMirror: PropTypes.bool.isRequired,
};
