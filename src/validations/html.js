var Promise = require('es6-promise').Promise;
var groupBy = require('lodash/groupBy');
var values = require('lodash/values');
var flatten = require('lodash/flatten');
var flatMap = require('lodash/flatMap');
var sortBy = require('lodash/sortBy');
var omit = require('lodash/omit');
var validateWithHtmllint = require('./html/htmllint.js');
var validateWithSlowparse = require('./html/slowparse.js');

function filterErrors(errors) {
  var groupedErrors = groupBy(errors, 'reason');

  var suppressedTypes = flatMap(
    flatten(values(groupedErrors)),
    'suppresses'
  );

  return flatten(values(omit(groupedErrors, suppressedTypes)));
}

module.exports = function(source) {
  return Promise.all([
    validateWithSlowparse(source),
    validateWithHtmllint(source),
  ]).then(function(results) {
    var filteredErrors = filterErrors(flatten(results));
    return sortBy(filteredErrors, 'row');
  });
};
