import React from 'react';
import {Provider} from 'react-redux';
import createApplicationStore from '../createApplicationStore';
import Workspace from './Workspace';
import {includeStoreInBugReports} from '../util/Bugsnag';

class Application extends React.Component {
  constructor() {
    super();
    const store = createApplicationStore();
    this.state = {store};
    includeStoreInBugReports(store);
  }

  render() {
    return (
      <Provider store={this.state.store}>
        <Workspace/>
      </Provider>
    );
  }
}

export default Application;
