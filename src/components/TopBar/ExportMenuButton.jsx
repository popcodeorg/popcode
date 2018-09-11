import {library} from '@fortawesome/fontawesome-svg-core';
import {faCaretDown} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import React from 'react';

library.add(faCaretDown);

export default function ExportMenuButton() {
  return <FontAwesomeIcon icon="caret-down" />;
}

ExportMenuButton.propTypes = {};
