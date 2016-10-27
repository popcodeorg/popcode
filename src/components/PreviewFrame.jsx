import React from 'react';
import Bowser from 'bowser';
import bindAll from 'lodash/bindAll';
import i18n from 'i18next-client';
import normalizeError from '../util/normalizeError';
import {sourceDelimiter} from '../util/generatePreview';

const sandboxOptions = [
  'allow-forms',
  'allow-popups',
  'allow-scripts',
  'allow-top-navigation',
].join(' ');

class PreviewFrame extends React.Component {
  constructor() {
    super();
    bindAll(this, '_onMessage', '_handleInfiniteLoop');
  }

  componentDidMount() {
    window.addEventListener('message', this._onMessage);
  }

  componentWillReceiveProps(nextProps) {
    if (this.shouldComponentUpdate(nextProps)) {
      this.props.onFrameWillRefresh();
    }
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.src !== this.props.src;
  }

  componentWillUnmount() {
    window.removeEventListener('message', this._onMessage);
  }

  _saveFrame(frame) {
    this.frame = frame;
    this._writeFrameContents(this.props.src);
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

    if (data.type === 'org.popcode.infinite-loop') {
      this._handleInfiniteLoop(data.line);
      return;
    }

    if (data.type !== 'org.popcode.error') {
      return;
    }

    const ErrorConstructor = window[data.error.name] || Error;
    const error = new ErrorConstructor(data.error.message);

    const normalizedError = normalizeError(error);
    let line = data.error.line - this._runtimeErrorLineOffset();

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
    const message = i18n.t('errors.javascriptRuntime.infinite-loop');
    this.props.onRuntimeError({
      reason: 'infinite-loop',
      text: message,
      raw: message,
      row: line - 1,
      column: 0,
      type: 'error',
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
      <iframe
        className="preview-frame"
        sandbox={sandboxOptions}
        {...srcProps}
      />
    );
  }
}

PreviewFrame.propTypes = {
  src: React.PropTypes.string.isRequired,
  onFrameWillRefresh: React.PropTypes.func.isRequired,
  onRuntimeError: React.PropTypes.func.isRequired,
};


export default PreviewFrame;
