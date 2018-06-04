import React from 'react';
import PropTypes from 'prop-types';
import isNull from 'lodash-es/isNull';

import {toReact as markdownToReact} from '../util/markdown';

import InstructionsEditor from './InstructionsEditor';

export default function Instructions({
  instructions,
  isEditing,
  isOpen,
  projectKey,
  onCancelEditing,
  onSaveChanges,
}) {
  if (isNull(projectKey) || !isEditing && !instructions || !isOpen) {
    return null;
  }

  return (
    <div
      className="layout__instructions"
    >
      {
        isEditing ?
          <InstructionsEditor
            instructions={instructions}
            projectKey={projectKey}
            onCancelEditing={onCancelEditing}
            onSaveChanges={onSaveChanges}
          /> :
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
  projectKey: PropTypes.string,
  onCancelEditing: PropTypes.func.isRequired,
  onSaveChanges: PropTypes.func.isRequired,
};

Instructions.defaultProps = {
  projectKey: null,
};
