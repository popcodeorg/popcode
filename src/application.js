var React = require('react');
var ReactDOM = require('react-dom');
var i18n = require('i18next-client');
var Workspace = require('./components/Workspace');

var i18nOptions = {
  fallbackLng: 'en',
  debug: true,
};
i18n.init(i18nOptions);

ReactDOM.render(React.createElement(Workspace), document.getElementById('main'));
