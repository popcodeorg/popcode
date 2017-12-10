import ACE from 'brace';
import bindAll from 'lodash/bindAll';
import isNil from 'lodash/isNil';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import createAceSessionWithoutWorker
  from '../util/createAceSessionWithoutWorker';

export default class ConsoleInput extends Component {
  constructor() {
    super();
    bindAll(this, '_ref');
  }

  _ref(containerElement) {
    const {onInput} = this.props;

    if (containerElement) {
      const computedStyle = getComputedStyle(containerElement);
      const editorOptions = {
        fontFamily: computedStyle.getPropertyValue('font-family'),
        fontSize: computedStyle.getPropertyValue('font-size'),
        highlightActiveLine: false,
        maxLines: 1,
        minLines: 1,
      };
      const editor = this._editor = ACE.edit(containerElement);
      const session = createAceSessionWithoutWorker('javascript');
      editor.setSession(session);
      editor.renderer.setShowGutter(false);
      session.setUseWrapMode(true);
      editor.moveCursorTo(0, 0);
      editor.setOptions(editorOptions);
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
  onInput: PropTypes.func.isRequired,
};
