import React from 'react';
import PropTypes from 'prop-types';
import {t} from 'i18next';

export default function InstructionsEditor({instructions, onCancelEditing}) {
  return (
    <div className="instructions-editor">
      <div className="instructions-editor-menu">
        <button onClick={onCancelEditing}>
          {t('workspace.components.instructions.cancel')}
        </button>
      </div>
      <pre contentEditable>
        {instructions}
      </pre>
    </div>
  );
}

InstructionsEditor.propTypes = {
  instructions: PropTypes.string.isRequired,
  onCancelEditing: PropTypes.func.isRequired,
};
