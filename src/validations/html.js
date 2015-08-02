var Promise = require('es6-promise').Promise;
var _ = require('lodash');
var validateWithHtmllint = require('./html/htmllint.js');

module.exports = function(source) {
  return Promise.all([validateWithHtmllint(source)]).
    then(function(results) {
      return _.flatten(results);
    });
};
