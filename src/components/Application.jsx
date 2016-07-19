import React from 'react';
import {Provider} from 'react-redux';
import bowser from 'bowser';
import createApplicationStore from '../createApplicationStore';
import Workspace from './Workspace';
import BrowserError from './BrowserError';
import {includeStoreInBugReports} from '../util/Bugsnag';

class Application extends React.Component {
  constructor() {
    super();
    const store = createApplicationStore();
    this.state = {store};
    includeStoreInBugReports(store);
  }

  _isUnsupportedBrowser() {
    return bowser.isUnsupportedBrowser({
      msie: '10',
      firefox: '12',
      chrome: '30',
      safari: '7.1',
    }, window.navigator.userAgent);
  }

  render() {
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
