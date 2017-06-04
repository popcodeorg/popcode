import React from 'react';
import {Provider} from 'react-redux';
import bowser from 'bowser';
import createApplicationStore from '../createApplicationStore';
import {includeStoreInBugReports} from '../util/Bugsnag';
import supportedBrowsers from '../../config/browsers.json';
import Workspace from './Workspace';
import BrowserError from './BrowserError';
import IEBrowserError from './IEBrowserError';

class Application extends React.Component {
  constructor() {
    super();
    const store = createApplicationStore();
    this.state = {store};
    includeStoreInBugReports(store);
  }

  _isIEOrEdge() {
    return (bowser.msie || bowser.msedge);
  }

  _isUnsupportedBrowser() {
    return bowser.isUnsupportedBrowser(
      supportedBrowsers,
      true,
      window.navigator.userAgent,
    );
  }

  render() {
    if (this._isIEOrEdge()) {
      return <IEBrowserError />;
    }

    if (this._isUnsupportedBrowser()) {
      return <BrowserError browser={bowser} />;
    }

    return (
      <Provider store={this.state.store}>
        <Workspace />
      </Provider>
    );
  }
}

export default Application;
