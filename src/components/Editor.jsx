import PropTypes from 'prop-types';
import React, {lazy} from 'react';

const AceEditor = lazy(() =>
  import(
    /* webpackChunkName: "editor-ace" */
    './AceEditor'
  ),
);

const CodeMirrorEditor = lazy(() =>
  import(
    /* webpackChunkName: "editor-codemirror" */
    './CodeMirrorEditor'
  ),
);

export default function Editor({useCodeMirror, ...props}) {
  if (useCodeMirror) {
    return <CodeMirrorEditor {...props} />;
  }
  return <AceEditor {...props} />;
}

Editor.propTypes = {
  useCodeMirror: PropTypes.bool.isRequired,
};
