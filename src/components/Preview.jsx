import React from 'react';
import {TextEncoder} from 'text-encoding';
import base64 from 'base64-js';

import PreviewFrame from './PreviewFrame';
import generatePreview from '../util/generatePreview';

class Preview extends React.Component {
  _generateDocument() {
    const project = this.props.project;

    if (project === undefined) {
      return '';
    }

    return generatePreview(project).documentElement.outerHTML;
  }

  _popOut() {
    const doc = this._generateDocument();
    const uint8array = new TextEncoder('utf-8').encode(doc);
    const base64encoded = base64.fromByteArray(uint8array);
    const url = `data:text/html;charset=utf-8;base64,${base64encoded}`;
    window.open(url, 'preview');
  }

  render() {
    return (
      <div className="preview output-item">
        <div
          className="preview-popOutButton"
          onClick={this._popOut.bind(this)}
        />
        <PreviewFrame
          src={this._generateDocument()}
          onRuntimeError={this.props.onRuntimeError}
          frameWillRefresh={this.props.clearRuntimeErrors}
        />
      </div>
    );
  }
}

Preview.propTypes = {
  project: React.PropTypes.object.isRequired,
  onRuntimeError: React.PropTypes.func.isRequired,
  clearRuntimeErrors: React.PropTypes.func.isRequired,
};

export default Preview;
