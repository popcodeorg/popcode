/* eslint-disable react/no-direct-mutation-state */
/* eslint-disable react/no-set-state */

import ACE from 'brace';
import bindAll from 'lodash/bindAll';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';

function createSessionWithoutWorker() {
  const session = ACE.createEditSession('', null);
  session.setUseWorker(false);
  session.setMode('ace/mode/javascript');
  return session;
}

export default class Console extends Component {
  constructor() {
    super();
    bindAll(this, '_handleInput');
    this.state = {
      history: [],
    };
  }

  _handleInput(containerElement) {
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
      this._editor = ACE.edit(containerElement);
      this._editor.renderer.setShowGutter(false);
      const session = createSessionWithoutWorker();
      session.setUseWrapMode(true);
      this._editor.setSession(session);
      this._editor.moveCursorTo(0, 0);
      this._editor.setOptions(editorOptions);
      this._editor.resize();

      session.on('change', ({action, lines}) => {
        if (action === 'insert' && lines.length === 2) {
          onInput(this._editor.getValue());
          this._editor.setValue('', 0);
        }
      });
    }
  }

  render() {
    const {history} = this.state;

    return (
      <div className="console output__item">
        {history.map(({command, output}) => (
          <div className="console__iteration" key={Math.random()}>
            <div className="console__command">{command}</div>
            <div className="console__output">=&gt; {output} </div>
          </div>
        ))}
        <div className="console__input" ref={this._handleInput} />
      </div>
    );
  }
}

Console.propTypes = {
  history: ImmutablePropTypes.iterable.isRequired,
  onInput: PropTypes.func.isRequired,
};
