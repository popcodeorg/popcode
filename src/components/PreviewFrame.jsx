import React from 'react';
import PropTypes from 'prop-types';
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
    bindAll(this, '_onMessage', '_handleInfiniteLoop');
  }

  componentDidMount() {
    window.addEventListener('message', this._onMessage);
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
    if (typeof message.data !== 'string') {
      return;
    }

    let data;
    try {
      data = JSON.parse(message.data);
    } catch (_e) {
      return;
    }

    if (data.type !== 'org.popcode.error') {
      return;
    }

    if (data.windowName !== this._frameName) {
      return;
    }

    let line = data.error.line - this._runtimeErrorLineOffset();

    if (data.error.message === 'Loop Broken!') {
      this._handleInfiniteLoop(line);
      return;
    }

    const ErrorConstructor = window[data.error.name] || Error;
    const error = new ErrorConstructor(data.error.message);

    const normalizedError = normalizeError(error);

    if (Bowser.safari) {
      line = 1;
    }

    this.props.onRuntimeError({
      reason: normalizedError.type,
      text: normalizedError.message,
      raw: normalizedError.message,
      row: line - 1,
      column: data.error.column,
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
    if (!frame) {
      return;
    }

    frame.addEventListener('load', () => {
      frame.classList.add('preview__frame_loaded');
    });
  }

  render() {
    let srcProps;

    if (this.props.src) {
      srcProps = {srcDoc: this.props.src};
    } else {
      srcProps = {src: 'about:blank'};
    }

    return (
      <div className="preview__frame-container">
        <iframe
          className="preview__frame"
          name={this._frameName}
          ref={this._attachToFrame}
          sandbox={sandboxOptions}
          {...srcProps}
        />
      </div>
    );
  }
}

PreviewFrame.propTypes = {
  src: PropTypes.string.isRequired,
  onRuntimeError: PropTypes.func.isRequired,
};


export default PreviewFrame;
