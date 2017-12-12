import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Bowser from 'bowser';
import bindAll from 'lodash/bindAll';
import {t} from 'i18next';
import normalizeError from '../util/normalizeError';
import {sourceDelimiter} from '../util/generatePreview';

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
    bindAll(this, '_attachToFrame', '_handleInfiniteLoop', '_onMessage');
  }

  componentDidMount() {
    window.addEventListener('message', this._onMessage);
  }

  componentWillReceiveProps(newProps) {
    const {consoleEntries: previousConsoleEntries, isActive} = this.props;

    if (this._frame && isActive) {
      for (const [key, {expression}] of newProps.consoleEntries) {
        if (!previousConsoleEntries.has(key)) {
          this._frame.contentWindow.postMessage(JSON.stringify({
            type: 'org.popcode.console.expression',
            payload: {key, expression},
          }), '*');
        }
      }
    }
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillUnmount() {
    window.removeEventListener('message', this._onMessage);
  }

  _runtimeErrorLineOffset() {
    const firstSourceLine = this.props.src.
      split('\n').indexOf(sourceDelimiter) + 2;

    return firstSourceLine - 1;
  }

  _onMessage(message) {
    if (!this.props.isActive) {
      return;
    }

    if (typeof message.data !== 'string') {
      return;
    }

    let type, windowName, payload;
    try {
      ({type, windowName, payload} = JSON.parse(message.data));
    } catch (_e) {
      return;
    }

    if (windowName !== this._frameName) {
      return;
    }

    switch (type) {
      case 'org.popcode.error':
        this._handleErrorMessage(payload);
        break;
      case 'org.popcode.console.value':
        this._handleConsoleValueMessage(payload);
        break;
      case 'org.popcode.console.error':
        this._handleConsoleErrorMessage(payload);
        break;
      default:
        break;
    }
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

  _handleConsoleErrorMessage({key, error: {name, message}}) {
    this.props.onConsoleError(key, name, message);
  }

  _handleConsoleValueMessage({key, value}) {
    this.props.onConsoleValue(key, JSON.stringify(value));
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
      return;
    }

    const {src} = this.props;

    if (src) {
      frame.addEventListener('load', () => {
        frame.classList.add('preview__frame_loaded');
      });

      frame.srcdoc = src;
    }
  }

  render() {
    return (
      <div className="preview__frame-container">
        <iframe
          className="preview__frame"
          name={this._frameName}
          ref={this._attachToFrame}
          sandbox={sandboxOptions}
          src="about:blank"
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
