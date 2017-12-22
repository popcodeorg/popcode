import React from 'react';
import PropTypes from 'prop-types';
import {toReact as markdownToReact} from '../util/markdown';

export default function Instructions({instructions, isOpen}) {
  if (!instructions || !isOpen) {
    return null;
  }

  return (
    <div
      className="layout__instructions"
    >
      <div className="instructions">
        {instructions ? markdownToReact(instructions) : null}
      </div>
    </div>
  );
}

Instructions.propTypes = {
  instructions: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
};
