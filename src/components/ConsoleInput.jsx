import bindAll from 'lodash/bindAll';
import isNil from 'lodash/isNil';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  createAceEditor,
  createAceSessionWithoutWorker,
  inheritFontStylesFromParentElement,
} from '../util/ace';

export default class ConsoleInput extends Component {
  constructor() {
    super();
    bindAll(this, '_ref');
  }

  componentWillReceiveProps({isTextSizeLarge, shouldFocus}) {
    if (isTextSizeLarge !== this.props.isTextSizeLarge) {
      requestAnimationFrame(() => {
        inheritFontStylesFromParentElement(this._editor);
      });
    }
    if (shouldFocus !== this.props.shouldFocus) {
      shouldFocus ? this._editor.focus() : this._editor.blur()
    }
  }

  _ref(containerElement) {
    const {onInput, shouldFocus} = this.props;

    if (containerElement) {
      const editor = this._editor = createAceEditor(containerElement);
      const session = createAceSessionWithoutWorker('javascript');
      editor.setSession(session);
      editor.renderer.setShowGutter(false);
      editor.moveCursorTo(0, 0);
      editor.setOptions({
        highlightActiveLine: false,
        maxLines: 1,
        minLines: 1,
      });
      editor.resize();
      shouldFocus ? editor.focus() : editor.blur();

      session.on('change', ({action, lines}) => {
        if (action === 'insert' && lines.length === 2) {
          onInput(editor.getValue().replace('\n', ''));
          editor.setValue('', 0);
        }
      });
    } else if (!isNil(this._editor)) {
      this._editor.destroy();
    }
  }

  render() {
    return <div className="console__input" ref={this._ref} />;
  }
}

ConsoleInput.propTypes = {
  isTextSizeLarge: PropTypes.bool,
  onInput: PropTypes.func.isRequired,
  shouldFocus: PropTypes.bool
};

ConsoleInput.defaultProps = {
  isTextSizeLarge: false,
  shouldFocus: false
};
