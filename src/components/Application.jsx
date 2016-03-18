import React from 'react';
import {Provider} from 'react-redux';
import store from '../store';
import Workspace from './Workspace';

class Application extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Workspace/>
      </Provider>
    );
  }
}

export default Application;
