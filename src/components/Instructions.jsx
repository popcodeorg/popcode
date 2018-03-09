import React from 'react';
import PropTypes from 'prop-types';
import {toReact as markdownToReact} from '../util/markdown';
import InstructionsEditor from './InstructionsEditor';

export default function Instructions({instructions, isEditing, isOpen}) {
  if (!isEditing && !instructions || !isOpen) {
    return null;
  }

  return (
    <div
      className="layout__instructions"
    >
      <div className="instructions">
        {
          isEditing ?
            <InstructionsEditor instructions={instructions} /> :
            markdownToReact(instructions)
        }
      </div>
    </div>
  );
}

Instructions.propTypes = {
  instructions: PropTypes.string.isRequired,
  isEditing: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
};
