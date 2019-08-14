import PropTypes from 'prop-types';
import React from 'react';
import {HotKeys} from 'react-hotkeys';

import keyMap from '../util/keyMap';

export default function KeyboardHandler({children, onSave}) {
  const handlers = {
    SAVE: () => {
      onSave();
      return false;
    },
  };

  return (
    <HotKeys handlers={handlers} keyMap={keyMap}>
      {children}
    </HotKeys>
  );
}

KeyboardHandler.propTypes = {
  children: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
};
