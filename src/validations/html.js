var Promise = require('es6-promise').Promise;
var lodash = require('lodash');
var validateWithHtmllint = require('./html/htmllint.js');
var validateWithSlowparse = require('./html/slowparse.js');

module.exports = function(source) {
  return Promise.all([
    validateWithSlowparse(source),
    validateWithHtmllint(source),
  ]).then(function(results) {
    return lodash.flatten(results);
  });
};
