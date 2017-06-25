import React from 'react';
import PropTypes from 'prop-types';
import {TextEncoder} from 'text-encoding';
import base64 from 'base64-js';
import bindAll from 'lodash/bindAll';
import classnames from 'classnames';
import generatePreview from '../util/generatePreview';
import {openWindowWithWorkaroundForChromeClosingBug} from '../util';
import PreviewFrame from './PreviewFrame';

class Preview extends React.Component {
  constructor() {
    super();
    bindAll(this, '_handlePopOutClick');
  }

  _generateDocument(isLivePreview = false) {
    if (!this.props.isValid) {
      return '';
    }
    const project = this.props.project;

    if (project === undefined) {
      return '';
    }

    return generatePreview(
      project,
      {
        targetBaseTop: isLivePreview,
        propagateErrorsToParent: isLivePreview,
        breakLoops: isLivePreview,
        nonBlockingAlertsAndPrompts: isLivePreview,
        lastRefreshTimestamp: isLivePreview && this.props.lastRefreshTimestamp,
      },
    );
  }

  _handlePopOutClick() {
    this._popOut();
  }

  _popOut() {
    const doc = this._generateDocument();
    const uint8array = new TextEncoder('utf-8').encode(doc);
    const base64encoded = base64.fromByteArray(uint8array);
    const url = `data:text/html;charset=utf-8;base64,${base64encoded}`;

    openWindowWithWorkaroundForChromeClosingBug(url);
  }

  render() {
    return (
      <div
        className={classnames(
          'preview',
          'output__item',
          {u__hidden: !this.props.isValid},
        )}
      >
        <span
          className="preview__button preview__button_reset"
          onClick={this.props.onRefreshClick}
        >&#xf021;</span>
        <span
          className="preview__button preview__button_pop-out"
          onClick={this._handlePopOutClick}
        >&#xf08e;</span>
        <PreviewFrame
          src={this._generateDocument(true)}
          onFrameWillRefresh={this.props.onClearRuntimeErrors}
          onRuntimeError={this.props.onRuntimeError}
        />
      </div>
    );
  }
}

Preview.propTypes = {
  isValid: PropTypes.bool.isRequired,
  lastRefreshTimestamp: PropTypes.number,
  project: PropTypes.object.isRequired,
  onClearRuntimeErrors: PropTypes.func.isRequired,
  onRefreshClick: PropTypes.func.isRequired,
  onRuntimeError: PropTypes.func.isRequired,
};

Preview.defaultProps = {
  lastRefreshTimestamp: null,
};

export default Preview;
