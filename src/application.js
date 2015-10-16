var React = require('react');
var i18n = require('i18next-client');
var Workspace = require('./components/Workspace.jsx');

var i18n_options = {
  fallbackLng: 'en',
  debug: true
};
i18n.init(i18n_options);

React.render(React.createElement(Workspace), document.getElementById('main'));
