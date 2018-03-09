import React from 'react';
import PropTypes from 'prop-types';
import {toReact as markdownToReact} from '../util/markdown';

export default function Instructions({instructions, isEditing, isOpen}) {
  if (!isEditing && !instructions || !isOpen) {
    return null;
  }

  return (
    <div
      className="layout__instructions"
    >
      {
        isEditing ?
          <pre contentEditable className="instructions instructions_editing">
            {instructions}
          </pre> :
          <div className="instructions">
            {markdownToReact(instructions)}
          </div>
      }
    </div>
  );
}

Instructions.propTypes = {
  instructions: PropTypes.string.isRequired,
  isEditing: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
};
