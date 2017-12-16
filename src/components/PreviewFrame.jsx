import Channel from 'jschannel';
import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Bowser from 'bowser';
import bindAll from 'lodash/bindAll';
import {t} from 'i18next';
import normalizeError from '../util/normalizeError';
import {sourceDelimiter} from '../util/compileProject';

const sandboxOptions = [
  'allow-forms',
  'allow-popups',
  'allow-scripts',
  'allow-top-navigation',
].join(' ');

let nextId = 1;

class PreviewFrame extends React.Component {
  constructor() {
    super();
    this._frameName = `preview-frame-${nextId++}`;
    bindAll(this, '_attachToFrame', '_handleInfiniteLoop');
  }

  componentWillReceiveProps(newProps) {
    const {consoleEntries: previousConsoleEntries, isActive} = this.props;

    if (this._channel && isActive) {
      for (const [key, {expression}] of newProps.consoleEntries) {
        if (!previousConsoleEntries.has(key)) {
          this._evaluateConsoleExpression(key, expression);
        }
      }
    }
  }

  shouldComponentUpdate() {
    return false;
  }

  _evaluateConsoleExpression(key, expression) {
    // eslint-disable-next-line prefer-reflect
    this._channel.call({
      method: 'evaluateExpression',
      params: expression,
      success: (result) => {
        this.props.onConsoleValue(key, JSON.stringify(result));
      },
      error: (name, message) => {
        this.props.onConsoleError(key, name, message);
      },
    });
  }

  _runtimeErrorLineOffset() {
    const firstSourceLine = this.props.src.
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

  _attachToFrame(frame) {
    this._frame = frame;

    if (!frame) {
      if (this._channel) {
        this._channel.destroy();
        Reflect.deleteProperty(this, '_channel');
      }
      return;
    }

    this._channel = Channel.build({
      window: frame.contentWindow,
      origin: '*',
      onReady() {
        frame.classList.add('preview__frame_loaded');
      },
    });

    this._channel.bind('error', (_trans, params) => {
      this._handleErrorMessage(params);
    });
  }

  render() {
    const {src} = this.props;
    return (
      <div className="preview__frame-container">
        <iframe
          className="preview__frame"
          name={this._frameName}
          ref={this._attachToFrame}
          sandbox={sandboxOptions}
          srcDoc={src}
        />
      </div>
    );
  }
}

PreviewFrame.propTypes = {
  consoleEntries: ImmutablePropTypes.iterable.isRequired,
  isActive: PropTypes.bool.isRequired,
  src: PropTypes.string.isRequired,
  onConsoleError: PropTypes.func.isRequired,
  onConsoleValue: PropTypes.func.isRequired,
  onRuntimeError: PropTypes.func.isRequired,
};

export default PreviewFrame;
