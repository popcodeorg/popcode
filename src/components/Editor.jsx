import PropTypes from 'prop-types';
import React, {lazy} from 'react';

import AceEditor from './AceEditor';

const CodeMirrorEditor = lazy(() =>
  import(
    /* webpackChunkName: "experimentalOnly" */
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
