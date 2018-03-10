import React from 'react';
import PropTypes from 'prop-types';
import {t} from 'i18next';
import bindAll from 'lodash/bindAll';

export default class InstructionsEditor extends React.Component {
  constructor({instructions}) {
    super();
    this.state = {instructions};
    bindAll(this, '_handleCancelEditing', '_handleSaveChanges', '_ref');
  }

  _handleCancelEditing() {
    this.props.onCancelEditing();
  }

  _handleSaveChanges() {
    const newValue = this.editor.innerText.trim();
    this.props.onSaveChanges(this.props.projectKey, newValue);
  }

  _ref(preElement) {
    this.editor = preElement;
  }

  render() {
    return (
      <div className="instructions-editor">
        <div className="instructions-editor-menu">
          <button onClick={this._handleSaveChanges}>
            {t('workspace.components.instructions.save')}
          </button>
          <button onClick={this._handleCancelEditing}>
            {t('workspace.components.instructions.cancel')}
          </button>
        </div>
        <pre contentEditable ref={this._ref}>
          {this.state.instructions}
        </pre>
      </div>
    );
  }
}

InstructionsEditor.propTypes = {
  instructions: PropTypes.string.isRequired,
  projectKey: PropTypes.string.isRequired,
  onCancelEditing: PropTypes.func.isRequired,
  onSaveChanges: PropTypes.func.isRequired,
};
