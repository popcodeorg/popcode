var validateWithCss = require('./css/css.js');
var validateWithPrettyCSS = require('./css/prettycss.js');

module.exports = function(source) {
  return validateWithCss(source).concat(validateWithPrettyCSS(source));
};
