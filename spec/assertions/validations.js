import {assert} from 'chai';
import map from 'lodash/map';

function assertPassesValidation(validate, source) {
  return assert.eventually.deepEqual(
    validate(source),
    [],
    'source passes validation'
  );
}

function assertFailsValidationWith(validate, source, ...reasons) {
  return assert.eventually.sameMembers(
    validate(source).then((errors) => map(errors, 'reason')),
    reasons,
    `source fails validation with reasons: ${reasons.join(', ')}`
  );
}

export {
  assertPassesValidation,
  assertFailsValidationWith,
};
