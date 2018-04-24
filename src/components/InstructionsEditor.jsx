import React from 'react';
import PropTypes from 'prop-types';
import {t} from 'i18next';
import bindAll from 'lodash/bindAll';

import SimpleMDE from 'react-simplemde-editor';

export default class InstructionsEditor extends React.Component {
  constructor() {
    super();
    bindAll(
      this,
      '_handleCancelEditing',
      '_handleContinueEditing',
      '_handleSaveChanges',
    );
  }

  _handleCancelEditing() {
    this.props.onCancelEditing();
  }

  _handleSaveChanges() {
    this.props.onSaveChanges(this.props.projectKey, this.props.instructions);
  }

  _handleContinueEditing(newValue) {
    this.props.onContinueEditing(this.props.projectKey, newValue);
  }

  render() {
    return (
      <div className="instructions-editor">
        <div className="instructions-editor__menu">
          <button
            className="instructions-editor__menu-button"
            onClick={this._handleSaveChanges}
          >
            {t('workspace.components.instructions.save')}
          </button>
          <button
            className="instructions-editor__menu-button"
            onClick={this._handleCancelEditing}
          >
            {t('workspace.components.instructions.cancel')}
          </button>
        </div>
        <div className="instructions-editor__input-container">
          <SimpleMDE
            options={{
              autofocus: true,
              spellChecker: false,
            }}
            value={this.props.instructions}
            onChange={this._handleContinueEditing}
          />
        </div>
        <div className="instructions-editor__footer">
          <a
            className="instructions-editor__footer-link"
            href="https://guides.github.com/features/mastering-markdown/"
            rel="noopener noreferrer"
            target="_blank"
          >
              Styling with Markdown is supported
          </a>
        </div>
      </div>
    );
  }
}

InstructionsEditor.propTypes = {
  instructions: PropTypes.string.isRequired,
  projectKey: PropTypes.string.isRequired,
  onCancelEditing: PropTypes.func.isRequired,
  onContinueEditing: PropTypes.func.isRequired,
  onSaveChanges: PropTypes.func.isRequired,
};
