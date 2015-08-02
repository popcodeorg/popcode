var Promise = require('es6-promise').Promise;
var _ = require('lodash');
var validateWithCss = require('./css/css.js');
var validateWithPrettyCSS = require('./css/prettycss.js');

module.exports = function(source) {
  return Promise.all([validateWithCss(source), validateWithPrettyCSS(source)]).
    then(function(results) {
      return _.flatten(results);
    });
};
