import React from 'react';
import PropTypes from 'prop-types';

import AceConsoleInput from './AceConsoleInput';
import CodeMirrorConsoleInput from './CodeMirrorConsoleInput';

export default function ConsoleInput({isExperimental, ...props}) {
  if (isExperimental) {
    return <CodeMirrorConsoleInput {...props} />;
  }
  return <AceConsoleInput {...props} />;
}

ConsoleInput.propTypes = {
  isExperimental: PropTypes.bool.isRequired,
};
