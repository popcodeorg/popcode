import i18next from 'i18next';
import assign from 'lodash-es/assign';
import get from 'lodash-es/get';
import isEmpty from 'lodash-es/isEmpty';
import keys from 'lodash-es/keys';

import bowser from '../services/bowser';

const normalizers = {
  Chrome: {
    TypeError: message => {
      let match;

      match = /^(\w+) is not a function$/u.exec(message);
      if (match) {
        return {type: 'not-a-function', params: {name: match[1]}};
      }

      match = /^Cannot (read|set) property '(.+)' of (null|undefined)$/u.exec(
        message,
      );
      if (match) {
        return {
          type: `${match[1]}-property-of-${match[3]}`,
          params: {property: match[2]},
        };
      }

      return null;
    },
  },

  Safari: {
    TypeError: message => {
      let match;

      match = /^(\w+) is not a function. \(In '\w+\(\)', '\w+' is (\w+|an instance of (\w+))\)$/u.exec(
        message,
      );

      if (match) {
        if (match[3]) {
          return {
            type: 'not-a-function',
            params: {name: match[1], type: match[3]},
          };
        }

        if (match[2] === 'undefined' || match[2] === 'null') {
          return {
            type: `${match[2]}-not-a-function`,
            params: {name: match[1]},
          };
        }

        return {
          type: 'not-a-function',
          params: {name: match[1], value: match[2]},
        };
      }

      match = /^(null|undefined) is not an object \(.*\)$/u.exec(message);
      if (match) {
        return {type: `access-property-of-${match[1]}`};
      }

      return null;
    },
  },

  Firefox: {
    TypeError: message => {
      let match;

      match = /^(\w+) is not a function$/u.exec(message);
      if (match) {
        return {type: 'not-a-function', params: {name: match[1]}};
      }

      match = /^([\w.]+) is (null|undefined)$/u.exec(message);
      if (match) {
        return {
          type: `access-property-of-${match[2]}`,
          params: {name: match[1]},
        };
      }

      return null;
    },
  },
};

function attachMessage(normalizedError) {
  let context;
  if (!isEmpty(normalizedError.params)) {
    context = `with-${keys(normalizedError.params).sort().join('-')}`;
  }

  return assign(normalizedError, {
    message: i18next.t(
      `errors.javascriptRuntime.${normalizedError.type}`,
      assign({context}, normalizedError.params),
    ),
  });
}

function normalizeError(error) {
  const normalizer = get(normalizers, [bowser.getBrowserName(), error.name]);
  if (normalizer !== undefined) {
    const normalizedError = normalizer(error.message);
    if (normalizedError !== null) {
      return attachMessage(normalizedError);
    }
  }

  return {
    type: 'unknown',
    message: error.message,
  };
}

export default normalizeError;
