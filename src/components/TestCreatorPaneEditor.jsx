import React from 'react';
import PropTypes from 'prop-types';
import bindAll from 'lodash-es/bindAll';
import constant from 'lodash-es/constant';
import throttle from 'lodash-es/throttle';

import {createAceEditor, createAceSessionWithoutWorker} from '../util/ace';

import 'brace/mode/javascript';
import 'brace/theme/monokai';

const RESIZE_THROTTLE = 250;
const NORMAL_FONTSIZE = 12;

export default class TestCreatorPane extends React.Component {
  constructor() {
    super();

    this._handleWindowResize = throttle(() => {
      if (this._editor) {
        this._resizeEditor();
      }
    }, RESIZE_THROTTLE);

    bindAll(this, '_setupEditor', '_startNewSession', '_resizeEditor');

    this.render = constant(
      <div className="editors__editor" ref={this._setupEditor} />,
    );
  }

  componentDidMount() {
    this._editor.setFontSize(NORMAL_FONTSIZE);
    window.addEventListener('resize', this._handleWindowResize);
  }

  componentDidUpdate({
    projectKey: prevProjectKey,
    tests: prevTests,
  }) {
    const {
      projectKey,
      tests,
    } = this.props;

    if (projectKey !== prevProjectKey) {
      this._startNewSession(tests);
    } else if (tests !== prevTests && tests !== this._editor.getValue()) {
      this._editor.setValue(tests);
    }
  }

  componentWillUnmount() {
    this._editor.destroy();
    window.removeEventListener('resize', this._handleWindowResize);
  }

  _resizeEditor() {
    this._editor.resize();
  }

  _setupEditor(containerElement) {
    if (containerElement) {
      this._editor = createAceEditor(containerElement);
      this._startNewSession(this.props.tests);
      this._resizeEditor();
      this._editor.on('focus', this._resizeEditor);
    } else {
      this._editor.destroy();
    }
  }

  _startNewSession(source) {
    const session = createAceSessionWithoutWorker('javascript', source);
    session.on('change', () => {
      this.props.onSaveTests(this._editor.getValue(), this.props.projectKey);
    });
    this._editor.setSession(session);
    this._editor.moveCursorTo(0, 0);
    this._resizeEditor();
  }
}

TestCreatorPane.propTypes = {
  projectKey: PropTypes.string.isRequired,
  tests: PropTypes.string.isRequired,
  onSaveTests: PropTypes.func.isRequired,
};
