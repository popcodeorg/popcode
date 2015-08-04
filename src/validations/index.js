var i18n = require('i18next-client');
i18n.init({
  fallbackLng: 'en',
  debug: true
});

module.exports = {
  i18n: i18n,
  html: require('./html.js'),
  css: require('./css.js'),
  javascript: require('./javascript.js')
}
