/* eslint-disable no-magic-numbers */

var Bowser = require('bowser');
var get = require('lodash/get');
var keys = require('lodash/keys');
var isEmpty = require('lodash/isEmpty');
var assign = require('lodash/assign');
var i18n = require('i18next-client');

var normalizers = {
  Chrome: {
    TypeError: function(message) {
      var match;

      match = /^(\w+) is not a function$/.exec(message);
      if (match) {
        return {type: 'not-a-function', params: {name: match[1]}};
      }

      match = /^Cannot (read|set) property '(.+)' of (null|undefined)$/.
        exec(message);
      if (match) {
        return {
          type: match[1] + '-property-of-' + match[3],
          params: {property: match[2]},
        };
      }
    },
  },

  Safari: {
    TypeError: function(message) {
      var match;

      match = /^(\w+) is not a function. \(In '\w+\(\)', '\w+' is (\w+|an instance of (\w+))\)$/.exec(message); // eslint-disable-line max-len

      if (match) {
        if (match[3]) {
          return {
            type: 'not-a-function',
            params: {name: match[1], type: match[3]},
          };
        }

        if (match[2] === 'undefined' || match[2] === 'null') {
          return {
            type: match[2] + '-not-a-function',
            params: {name: match[1]},
          };
        }

        return {
          type: 'not-a-function',
          params: {name: match[1], value: match[2]},
        };
      }

      match = /^(null|undefined) is not an object \(.*\)$/.exec(message);
      if (match) {
        return {type: 'access-property-of-' + match[1]};
      }
    },
  },
};

function attachMessage(normalizedError) {
  var context;
  if (!isEmpty(normalizedError.params)) {
    context = 'with-' + keys(normalizedError.params).sort().join('-');
  }

  return assign(normalizedError, {
    message: i18n.t(
      'errors.javascriptRuntime.' + normalizedError.type,
      assign({context: context}, normalizedError.params)
    ),
  });
}

function normalizeError(error) {
  var normalizer = get(normalizers, [Bowser.name, error.name]);
  if (normalizer !== undefined) {
    var normalizedError = normalizer(error.message);
    if (normalizedError !== undefined) {
      return attachMessage(normalizedError);
    }
  }

  return {
    type: 'unknown',
    message: error.name + ': ' + error.message,
  };
}

module.exports = normalizeError;
