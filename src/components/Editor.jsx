import React from 'react';
import PropTypes from 'prop-types';
<<<<<<< HEAD
import bindAll from 'lodash-es/bindAll';
import constant from 'lodash-es/constant';
import get from 'lodash-es/get';
import throttle from 'lodash-es/throttle';
import noop from 'lodash-es/noop';

import {createAceEditor, createAceSessionWithoutWorker} from '../util/ace';
import {EditorLocation} from '../records';
import {cssSelectorAtCursor} from '../util/cssSelectorAtCursor';
=======
import ACE from 'brace';
import bindAll from 'lodash/bindAll';
import get from 'lodash/get';
import throttle from 'lodash/throttle';
import noop from 'lodash/noop';
>>>>>>> 621d5f6... Add saga, add ref to iframe element

import 'brace/ext/searchbox';
import 'brace/mode/html';
import 'brace/mode/css';
import 'brace/mode/javascript';
import 'brace/theme/monokai';

const RESIZE_THROTTLE = 250;
const NORMAL_FONTSIZE = 14;
const LARGE_FONTSIZE = 20;

class Editor extends React.Component {
  constructor() {
    super();

    this._handleWindowResize = throttle(() => {
      if (this._editor) {
        this._resizeEditor();
      }
    }, RESIZE_THROTTLE);

    bindAll(this, '_handleWindowResize', '_resizeEditor', '_setupEditor');

    this.render = constant(
      <div className="editors__editor" ref={this._setupEditor} />,
    );
  }

  componentDidMount() {
    this._focusRequestedLine(this.props.requestedFocusedLine);
    this._applyFontSize(this.props.textSizeIsLarge);
    window.addEventListener('resize', this._handleWindowResize);
  }

  componentDidUpdate({
    percentageOfHeight: prevPercentageOfHeight,
    projectKey: prevProjectKey,
    source: prevSource,
  }) {
    const {
      errors,
      percentageOfHeight,
      projectKey,
      requestedFocusedLine,
      source,
      textSizeIsLarge,
    } = this.props;

    if (projectKey !== prevProjectKey) {
      this._startNewSession(source);
    } else if (source !== prevSource && source !== this._editor.getValue()) {
      this._editor.setValue(source);
    }

    this._focusRequestedLine(requestedFocusedLine);
    this._applyFontSize(textSizeIsLarge);

    if (percentageOfHeight !== prevPercentageOfHeight) {
      requestAnimationFrame(this._resizeEditor);
    }

    this._editor.getSession().setAnnotations(errors);
  }

  componentWillUnmount() {
    this._editor.destroy();
    window.removeEventListener('resize', this._handleWindowResize);
  }

  _focusRequestedLine(requestedFocusedLine) {
    if (get(requestedFocusedLine, 'component') !==
      `editor.${this.props.language}`) {
      return;
    }

    this._editor.moveCursorTo(
      requestedFocusedLine.line,
      requestedFocusedLine.column,
    );

    this._scrollToLine(requestedFocusedLine.line);
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
      this._editor = createAceEditor(containerElement);
      this._startNewSession(this.props.source);
      this._resizeEditor();
      this._editor.on('focus', this._resizeEditor);
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
      this._editor.on('blur', () => {
        this.props.onEditorBlurred();
      });
      this._editor.on('focus', () => {
        this.props.onEditorFocused(this.props.language);
      });
=======
>>>>>>> ec49c81... Handle fixed potion, handle body and html, handle resize, handle editor refocus to same line
      this._editor.setOptions({
        fontFamily: 'Inconsolata',
        fontSize: '14px',
      });
>>>>>>> 23eb7f2... Updates to element highlighter
=======
>>>>>>> e90fafb... update window resize, update element highlighter, write unit test
    } else {
      this._editor.destroy();
    }
  }

  _applyFontSize(textSizeIsLarge) {
    if (textSizeIsLarge) {
      this._editor.setFontSize(LARGE_FONTSIZE);
    } else {
      this._editor.setFontSize(NORMAL_FONTSIZE);
    }
  }

  _startNewSession(source) {
    const session = createAceSessionWithoutWorker(this.props.language, source);
    const cursor = session.selection.lead;
    session.on('change', () => {
      this.props.onInput(this._editor.getValue());
    });
    session.selection.on('changeCursor', () => {
      this.props.onCursorChange(
        this._editor.getValue(),
        cursor,
        this.props.language,
      );
    });
    this._editor.on('blur', () => {
      this.props.onEditorBlurred();
    });
    this._editor.on('focus', () => {
      this.props.onEditorFocused(
        this._editor.getValue(),
        cursor,
        this.props.language,
      );
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
  errors: PropTypes.array.isRequired,
  language: PropTypes.string.isRequired,
  percentageOfHeight: PropTypes.number.isRequired,
  projectKey: PropTypes.string.isRequired,
  requestedFocusedLine: PropTypes.instanceOf(EditorLocation),
  source: PropTypes.string.isRequired,
  textSizeIsLarge: PropTypes.bool.isRequired,
  onCursorChange: PropTypes.func.isRequired,
  onEditorBlurred: PropTypes.func.isRequired,
  onEditorFocused: PropTypes.func.isRequired,
  onInput: PropTypes.func.isRequired,
  onRequestedLineFocused: PropTypes.func.isRequired,
};

Editor.defaultProps = {
  requestedFocusedLine: null,
  textSizeIsLarge: false,
};

export default Editor;
