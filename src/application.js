import 'core-js';
import 'regenerator-runtime/runtime';
import 'whatwg-fetch';
import 'raf/polyfill';
import './init/DOMParserShim';

import React from 'react';
import ReactDOM from 'react-dom';

import init from './init';
import Application from './components/Application';

const {store} = init();

ReactDOM.render(
  React.createElement(Application, {store}),
  document.getElementById('main'),
);
