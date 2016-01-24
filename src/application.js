var React = require('react');
var ReactDOM = require('react-dom');
var Immutable = require('immutable');
var Provider = require('react-redux').Provider;
var i18n = require('i18next-client');
var installDevTools = require('immutable-devtools');

var Workspace = require('./components/Workspace');
var store = require('./store');

var i18nOptions = {
  fallbackLng: 'en',
  debug: true,
};
i18n.init(i18nOptions);

installDevTools(Immutable);

ReactDOM.render(
  React.createElement(
    Provider,
    {store: store},
    React.createElement(Workspace)
  ),
  document.getElementById('main')
);
