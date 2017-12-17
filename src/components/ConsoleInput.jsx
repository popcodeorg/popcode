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

  componentWillReceiveProps({isTextSizeLarge}) {
    if (isTextSizeLarge !== this.props.isTextSizeLarge) {
      requestAnimationFrame(() => {
        inheritFontStylesFromParentElement(this._editor);
      });
    }
  }

  _ref(containerElement) {
    const {onInput} = this.props;

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
      editor.focus();

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
};

ConsoleInput.defaultProps = {
  isTextSizeLarge: false,
};
