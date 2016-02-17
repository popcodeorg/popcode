import React from 'react';
import {TextEncoder} from 'text-encoding';
import base64 from 'base64-js';

import PreviewFrame from './PreviewFrame';
import generatePreview from '../util/generatePreview';

class Preview extends React.Component {
  _generateDocument() {
    var project = this.props.project;

    if (project === undefined) {
      return '';
    }

    return generatePreview(project).documentElement.outerHTML;
  }

  _popOut() {
    var doc = this._generateDocument();
    var uint8array = new TextEncoder('utf-8').encode(doc);
    var base64encoded = base64.fromByteArray(uint8array);
    var url = 'data:text/html;charset=utf-8;base64,' + base64encoded;
    window.open(url, 'preview');
  }

  render() {
    return (
      <div className="preview">
        <div className="preview-popOutButton" onClick={this._popOut} />
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

module.exports = Preview;
