import React from 'react';
import ACE from 'brace';
import bindAll from 'lodash/bindAll';
import get from 'lodash/get';
import throttle from 'lodash/throttle';
import noop from 'lodash/noop';

import 'brace/mode/html';
import 'brace/mode/css';
import 'brace/mode/javascript';
import 'brace/theme/monokai';

const RESIZE_THROTTLE = 250;

function createSessionWithoutWorker(source, language) {
  const session = ACE.createEditSession(source, null);
  session.setUseWorker(false);
  session.setMode(`ace/mode/${language}`);
  return session;
}

class Editor extends React.Component {
  constructor() {
    super();

    this._handleWindowResize = throttle(() => {
      if (this._editor) {
        this._resizeEditor();
      }
    }, RESIZE_THROTTLE);

    bindAll(this, '_handleWindowResize', '_resizeEditor', '_setupEditor');
  }

  componentDidMount() {
    this._focusRequestedLine(this.props.requestedFocusedLine);
    window.addEventListener('resize', this._handleWindowResize);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.projectKey !== this.props.projectKey) {
      this._startNewSession(nextProps.source);
    } else if (nextProps.source !== this.props.source &&
        nextProps.source !== this._editor.getValue()) {
      this._editor.setValue(nextProps.source);
    }

    this._focusRequestedLine(nextProps.requestedFocusedLine);

    if (nextProps.percentageOfHeight !== this.props.percentageOfHeight) {
      requestAnimationFrame(this._resizeEditor);
    }

    this._editor.getSession().setAnnotations(nextProps.errors);
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillUnmount() {
    this._editor.destroy();
    window.removeEventListener('resize', this._handleWindowResize);
  }

  _focusRequestedLine(requestedFocusedLine) {
    if (get(requestedFocusedLine, 'language') !== this.props.language) {
      return;
    }

    this._editor.moveCursorTo(
      requestedFocusedLine.line,
      requestedFocusedLine.column,
    );

    this._scrollToLine(requestedFocusedLine.line);

    this._editor.clearSelection();
    this._editor.focus();
    this.props.onRequestedLineFocused();
  }

  _resizeEditor() {
    this._editor.resize();
  }

  _scrollToLine(lineNumber) {
    const shouldCenterVertically = true;
    const shouldAnimate = true;
    this._editor.scrollToLine(
      lineNumber,
      shouldCenterVertically,
      shouldAnimate,
      noop,
    );
  }

  _setupEditor(containerElement) {
    if (containerElement) {
      this._editor = ACE.edit(containerElement);
      this._editor.$blockScrolling = Infinity;
      this._startNewSession(this.props.source);
      this._disableAutoClosing();
      this._resizeEditor();
      this._editor.on('focus', this._resizeEditor);
      this._editor.setOptions({
        fontFamily: 'Inconsolata',
        fontSize: '14px',
      });
    } else {
      this._editor.destroy();
    }
  }

  _disableAutoClosing() {
    this._editor.setBehavioursEnabled(false);
  }

  _startNewSession(source) {
    const session = createSessionWithoutWorker(source, this.props.language);
    session.setUseWrapMode(true);
    session.on('change', () => {
      this.props.onInput(this._editor.getValue());
    });
    session.setAnnotations(this.props.errors);
    this._editor.setSession(session);
    this._editor.moveCursorTo(0, 0);
    this._resizeEditor();
  }

  render() {
    return (
      <div
        className="editors__editor"
        ref={this._setupEditor}
      />
    );
  }

}

Editor.propTypes = {
  errors: React.PropTypes.array.isRequired,
  language: React.PropTypes.string.isRequired,
  percentageOfHeight: React.PropTypes.number.isRequired,
  projectKey: React.PropTypes.string.isRequired,
  requestedFocusedLine: React.PropTypes.object,
  source: React.PropTypes.string.isRequired,
  onInput: React.PropTypes.func.isRequired,
  onRequestedLineFocused: React.PropTypes.func.isRequired,
};

export default Editor;
