import React from 'react';
import ReactDOM from 'react-dom';
import Immutable from 'immutable';
import installDevTools from 'immutable-devtools';
import Application from './components/Application';
import 'babel-polyfill';

installDevTools(Immutable);

ReactDOM.render(
  React.createElement(Application),
  document.getElementById('main')
);
