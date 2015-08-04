var i18n = require('i18next-client');
i18n.init({
  fallbackLng: 'en',
  debug: true
});

module.exports = {
  html: require('./html.js'),
  css: require('./css.js'),
  javascript: require('./javascript.js')
}
