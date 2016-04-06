import React from 'react';
import {Provider} from 'react-redux';
import createApplicationStore from '../createApplicationStore';
import Workspace from './Workspace';

class Application extends React.Component {
  constructor() {
    super();
    this.state = {store: createApplicationStore()};
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
