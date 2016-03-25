import React from 'react';
import ACE from 'brace';
import i18n from 'i18next-client';

import 'brace/mode/html';
import 'brace/mode/css';
import 'brace/mode/javascript';
import 'brace/theme/monokai';

class Editor extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.projectKey !== this.props.projectKey) {
      this._startNewSession(nextProps.source);
    } else if (nextProps.source !== this._editor.getValue()) {
      this._editor.setValue(nextProps.source);
    }

    this._editor.getSession().setAnnotations(nextProps.errors);
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillUnmount() {
    this._editor.destroy();
  }

  _jumpToLine(line, column) {
    this._editor.moveCursorTo(line, column);
    this._editor.focus();
  }

  _setupEditor(containerElement) {
    if (containerElement) {
      this._editor = ACE.edit(containerElement);
      this._configureSession(this._editor.getSession());
      this._disableAutoClosing();
    } else {
      this._editor.destroy();
    }
  }

  _disableAutoClosing() {
    this._editor.setBehavioursEnabled(false);
  }

  _startNewSession(source) {
    const session = new ACE.EditSession(source);
    this._configureSession(session);
    this._editor.setSession(session);
    this._editor.moveCursorTo(0, 0);
  }

  _configureSession(session) {
    const language = this.props.language;
    session.setUseWorker(false);
    session.setMode(`ace/mode/${language}`);
    session.on('change', () => {
      this.props.onInput(this._editor.getValue());
    });
  }

  _renderLabel() {
    return (
      <div className="editorContainer-label">
        {i18n.t(`languages.${this.props.language}`)}
      </div>
    );
  }

  _renderEditor() {
    return (
      <div
        className="editorContainer-editor"
        ref={this._setupEditor.bind(this)}
      >
        {this.props.source}
      </div>
    );
  }

  render() {
    return (
      <div className="editorContainer">
        {this._renderLabel()}
        {this._renderEditor()}
      </div>
    );
  }
}

Editor.propTypes = {
  projectKey: React.PropTypes.string.isRequired,
  source: React.PropTypes.string.isRequired,
  errors: React.PropTypes.array.isRequired,
  language: React.PropTypes.string.isRequired,
  onInput: React.PropTypes.func.isRequired,
};

export default Editor;
