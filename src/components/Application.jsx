import mapValues from 'lodash-es/mapValues';
import PropTypes from 'prop-types';
import React from 'react';
import {Provider} from 'react-redux';

import supportedBrowsers from '../../config/browsers.json';
import Workspace from '../containers/Workspace';
import bowser from '../services/bowser';
import {ErrorBoundary} from '../util/bugsnag';

import BrowserError from './BrowserError';
import IEBrowserError from './IEBrowserError';

export default class Application extends React.Component {
  _isIEOrEdge() {
    return bowser.some(['Internet Explorer', 'Microsoft Edge']);
  }

  _isUnsupportedBrowser() {
    const supportedBrowsersForBowser = mapValues(
      supportedBrowsers,
      version => `>=${version}`,
    );
    supportedBrowsersForBowser.chromium = supportedBrowsersForBowser.chrome;
    return !bowser.satisfies(supportedBrowsersForBowser);
  }

  render() {
    if (this._isIEOrEdge()) {
      return <IEBrowserError />;
    }

    if (this._isUnsupportedBrowser()) {
      return <BrowserError browser={bowser} />;
    }

    return (
      <ErrorBoundary>
        <Provider store={this.props.store}>
          <Workspace />
        </Provider>
      </ErrorBoundary>
    );
  }
}

Application.propTypes = {
  store: PropTypes.object.isRequired,
};
