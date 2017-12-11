import Channel from 'jschannel';
import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Bowser from 'bowser';
<<<<<<< HEAD
import bindAll from 'lodash-es/bindAll';
import constant from 'lodash-es/constant';
=======
import bindAll from 'lodash/bindAll';
import includes from 'lodash/includes';
>>>>>>> 23eb7f2... Updates to element highlighter
import {t} from 'i18next';

import normalizeError from '../util/normalizeError';
import retryingFailedImports from '../util/retryingFailedImports';
import {sourceDelimiter} from '../util/compileProject';
import {CompiledProject as CompiledProjectRecord} from '../records';

const sandboxOptions = [
  'allow-forms',
  'allow-popups',
  'allow-popups-to-escape-sandbox',
  'allow-scripts',
  'allow-top-navigation',
].join(' ');

let nextId = 1;

class PreviewFrame extends React.Component {
  constructor(props) {
    super(props);

    const {compiledProject: {source}} = props;

<<<<<<< HEAD
<<<<<<< HEAD
    bindAll(this, '_attachToFrame', '_handleInfiniteLoop');
=======
  componentWillReceiveProps(nextProps) {
    if (!includes(nextProps.focusedEditors, 'css')) {
=======
  componentWillReceiveProps(newProps) {
    if (includes(this.props.focusedEditors, 'css') &&
      !includes(newProps.focusedEditors, 'css')) {
>>>>>>> 3cc1d22... Update selector at cursor and handle unfocused editor
      this._postRemoveHighlightToFrame();
    }
    if (newProps.focusedSelector !== this.props.focusedSelector ||
      includes(newProps.focusedEditors, 'css')) {
      this._postFocusedSelectorToFrame(newProps.focusedSelector);
    }
<<<<<<< HEAD
  }
>>>>>>> 23eb7f2... Updates to element highlighter

    this.render = constant(
      <div className="preview__frame-container">
        <iframe
          className="preview__frame"
          name={`preview-frame-${nextId++}`}
          ref={this._attachToFrame}
          sandbox={sandboxOptions}
          srcDoc={source}
        />
      </div>,
    );
  }
=======

    const {consoleEntries: previousConsoleEntries, isActive} = this.props;
>>>>>>> 3cc1d22... Update selector at cursor and handle unfocused editor

  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.highlighterSelector !== this.props.highlighterSelector) {
  //     this._postHighlighterSelectorToFrame(nextProps.highlighterSelector);
  //   }
  // }
  // componentDidMount() {
  //   window.addEventListener('message', this._onMessage);
  //   this._postFocusedSelectorToFrame(this.props.focusedSelector);
  // }

  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.focusedSelector !== this.props.focusedSelector) {
  //     this._postFocusedSelectorToFrame(nextProps.focusedSelector);
  //   }
  // }

  componentDidUpdate({consoleEntries: prevConsoleEntries}) {
    const {consoleEntries, isActive} = this.props;

    if (this._channel && isActive) {
      for (const [key, {expression}] of consoleEntries) {
        if (!prevConsoleEntries.has(key) && expression) {
          this._evaluateConsoleExpression(key, expression);
        }
      }
    }
  }

  async _evaluateConsoleExpression(key, expression) {
    const {hasExpressionStatement} = await retryingFailedImports(
      () => import(
        /* webpackChunkName: "mainAsync" */
        '../util/javascript',
      ),
    );
    // eslint-disable-next-line prefer-reflect
    this._channel.call({
      method: 'evaluateExpression',
      params: expression,
      success: (printedResult) => {
        this.props.onConsoleValue(
          key,
          hasExpressionStatement(expression) ? printedResult : null,
          this.props.compiledProject.compiledProjectKey,
        );
      },
      error: (name, message) => {
        this.props.onConsoleError(
          key,
          name,
          message,
          this.props.compiledProject.compiledProjectKey,
        );
      },
    });
  }

  _runtimeErrorLineOffset() {
    const firstSourceLine = this.props.compiledProject.source.
      split('\n').indexOf(sourceDelimiter) + 2;

    return firstSourceLine - 1;
  }

  _handleErrorMessage(error) {
    let line = error.line - this._runtimeErrorLineOffset();

    if (error.message === 'Loop Broken!') {
      this._handleInfiniteLoop(line);
      return;
    }

    const ErrorConstructor = window[error.name] || Error;
    const normalizedError = normalizeError(
      new ErrorConstructor(error.message),
    );

    if (Bowser.safari) {
      line = 1;
    }

    this.props.onRuntimeError({
      reason: normalizedError.type,
      text: normalizedError.message,
      raw: normalizedError.message,
      row: line - 1,
      column: error.column,
      type: 'error',
    });
  }

  _handleInfiniteLoop(line) {
    const message = t('errors.javascriptRuntime.infinite-loop');
    this.props.onRuntimeError({
      reason: 'infinite-loop',
      text: message,
      raw: message,
      row: line - 1,
      column: 0,
      type: 'error',
    });
  }

  _handleConsoleLog(printedValue) {
    const {compiledProjectKey} = this.props.compiledProject;
    this.props.onConsoleLog(printedValue, compiledProjectKey);
  }

  _postHighlighterSelectorToFrame(selector) {
    window.frames[0].postMessage(JSON.stringify({
      type: 'highlightElement',
      selector: {selector},
    }), '*');
  }

  _postFocusedSelectorToFrame(selector) {
    this._frame_element.contentWindow.postMessage(JSON.stringify({
      type: 'org.popcode.highlightElement',
      selector,
    }), '*');
  }

<<<<<<< HEAD
  _attachToFrame(frame) {
    if (!frame) {
      if (this._channel) {
        this._channel.destroy();
        Reflect.deleteProperty(this, '_channel');
      }
      return;
=======
  _postRemoveHighlightToFrame() {
    this._frame_element.contentWindow.postMessage(JSON.stringify({
      type: 'org.popcode.removeHighlight',
    }), '*');
  }

  _setFrameElement(frame) {
    this._frame_element = frame;
  }

  render() {
    let srcProps;

    if (this.props.src) {
      srcProps = {srcDoc: this.props.src};
    } else {
      srcProps = {src: 'about:blank'};
>>>>>>> 23eb7f2... Updates to element highlighter
    }

    this._channel = Channel.build({
      window: frame.contentWindow,
      origin: '*',
      onReady() {
        frame.classList.add('preview__frame_loaded');
      },
    });

    this._channel.bind('error', (_trans, params) => {
      if (this.props.isActive) {
        this._handleErrorMessage(params);
      }
    });
    this._channel.bind('log', (_trans, params) => {
      if (this.props.isActive) {
        this._handleConsoleLog(params);
      }
    });
  }
}

PreviewFrame.propTypes = {
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
  compiledProject: PropTypes.instanceOf(CompiledProjectRecord).isRequired,
  consoleEntries: ImmutablePropTypes.iterable.isRequired,
=======
  focusedEditors: PropTypes.array,
>>>>>>> 23eb7f2... Updates to element highlighter
=======
  consoleEntries: ImmutablePropTypes.iterable.isRequired,
  focusedEditors: PropTypes.array,
>>>>>>> 3cc1d22... Update selector at cursor and handle unfocused editor
  focusedSelector: PropTypes.string,
  isActive: PropTypes.bool.isRequired,
  onConsoleError: PropTypes.func.isRequired,
  onConsoleLog: PropTypes.func.isRequired,
  onConsoleValue: PropTypes.func.isRequired,
=======
  src: PropTypes.string.isRequired,
>>>>>>> 621d5f6... Add saga, add ref to iframe element
  onRuntimeError: PropTypes.func.isRequired,
};

PreviewFrame.defaultProps = {
  focusedEditors: null,
  focusedSelector: null,
};

export default PreviewFrame;
