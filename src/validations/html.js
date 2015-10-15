var Promise = require('es6-promise').Promise;
var lodash = require('lodash');
var validateWithHtmllint = require('./html/htmllint.js');

module.exports = function(source) {
  return Promise.all([validateWithHtmllint(source)]).
    then(function(results) {
      return lodash.flatten(results);
    });
};
