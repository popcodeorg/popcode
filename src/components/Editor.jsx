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
      this._editor.$blockScrolling = Infinity;
      this._startNewSession(this.props.source);
      this._disableAutoClosing();
      this._editor.resize();
      this._editor.on('focus', this._editor.resize.bind(this._editor));
    } else {
      this._editor.destroy();
    }
  }

  _disableAutoClosing() {
    this._editor.setBehavioursEnabled(false);
  }

  _startNewSession(source) {
    const session = this._createSessionWithoutWorker(source);
    session.setUseWrapMode(true);
    session.on('change', () => {
      this.props.onInput(this._editor.getValue());
    });
    session.setAnnotations(this.props.errors);
    this._editor.setSession(session);
    this._editor.moveCursorTo(0, 0);
    this._editor.resize();
  }

  _createSessionWithoutWorker(source) {
    const language = this.props.language;
    const session = ACE.createEditSession(source, null);
    session.setUseWorker(false);
    session.setMode(`ace/mode/${language}`);
    return session;
  }

  _renderLabel() {
    return (
      <div
        className="editors-editorContainer-label"
        onClick={this.props.onMinimize}
      >
        {i18n.t(`languages.${this.props.language}`)}
      </div>
    );
  }

  _renderEditor() {
    return (
      <div
        className="editors-editorContainer-editor"
        ref={this._setupEditor.bind(this)}
      />
    );
  }

  render() {
    return (
      <div className="editors-editorContainer">
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
  onMinimize: React.PropTypes.func.isRequired,
};

export default Editor;
