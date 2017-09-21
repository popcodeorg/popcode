import bindAll from 'lodash/bindAll';
import Clipboard from 'clipboard';
import noop from 'lodash/noop';
import React from 'react';
import PropTypes from 'prop-types';
import ZeroClipboard from 'zeroclipboard';

export default class CopyToClipboard extends React.Component {
  constructor() {
    super();
    bindAll(this, '_handleClick', '_handleChildLifecycle');
  }

  _handleClick() {
    if (Clipboard.isSupported()) {
      return;
    }

    const {promptText, text} = this.props;
    prompt(promptText, text); // eslint-disable-line no-alert
  }

  _handleChildLifecycle(element) {
    if (Clipboard.isSupported()) {
      this._attachClipboard(element);
    } else {
      this._attachZeroClipboard(element);
    }
  }

  _attachClipboard(element) {
    if (element) {
      this._clipboard = new Clipboard(element, {text: () => this.props.text});
      this._clipboard.on('success', this.props.onCopy);
    } else {
      this._clipboard.destroy();
      Reflect.deleteProperty(this, 'clipboard');
    }
  }

  _attachZeroClipboard(element) {
    if (element) {
      this._zeroClipboard = new ZeroClipboard(element);
      this._zeroClipboard.on('copy', (event) => {
        const clipboard = event.clipboardData;
        clipboard.setData('text/plain', this.props.text);
        this.props.onCopy();
      });
    } else {
      this._zeroClipboard.destroy();
      Reflect.deleteProperty(this, '_zeroClipboard');
    }
  }

  render() {
    const {children} = this.props;

    return React.cloneElement(
      React.Children.only(children),
      {onClick: this._handleClick, ref: this._handleChildLifecycle},
    );
  }
}

CopyToClipboard.propTypes = {
  children: PropTypes.element.isRequired,
  promptText: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  onCopy: PropTypes.func,
};

CopyToClipboard.defaultProps = {
  onCopy: noop,
};
