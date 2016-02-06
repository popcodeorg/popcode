var React = require('react');
var ReactDOM = require('react-dom');
var Immutable = require('immutable');
var Provider = require('react-redux').Provider;
var i18n = require('i18next-client');
var installDevTools = require('immutable-devtools').default;
var fs = require('fs');
var path = require('path');

var Workspace = require('./components/Workspace');
var store = require('./store');

var translations = {
  en: {
    translation: JSON.parse(fs.readFileSync(
      path.join(__dirname, '/../locales/en/translation.json')
    )),
  },
};

i18n.init({
  fallbackLng: 'en',
  debug: true,
  resStore: translations,
});

installDevTools(Immutable);

ReactDOM.render(
  React.createElement(
    Provider,
    {store: store},
    React.createElement(Workspace)
  ),
  document.getElementById('main')
);
