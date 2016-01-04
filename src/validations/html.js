var Promise = require('es6-promise').Promise;
var lodash = require('lodash');
var validateWithHtmllint = require('./html/htmllint.js');
var validateWithSlowparse = require('./html/slowparse.js');

function filterErrors(errors) {
  var indexedErrors = lodash(errors).indexBy('reason');

  var suppressedTypes = indexedErrors.
    values().
    map('suppresses').
    flatten().
    value();

  return indexedErrors.omit(suppressedTypes).values().value();
}

module.exports = function(source) {
  return Promise.all([
    validateWithSlowparse(source),
    validateWithHtmllint(source),
  ]).then(function(results) {
    var filteredErrors = filterErrors(lodash.flatten(results));
    return lodash.sortBy(filteredErrors, 'row');
  });
};
