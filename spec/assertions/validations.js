import {assert} from 'chai';
import map from 'lodash/map';
import trim from 'lodash/trim';

export function assertPassesValidation(validate, source, validatorArgs = []) {
  return assert.eventually.deepEqual(
    validate(source, ...validatorArgs),
    [],
    'source passes validation'
  );
}

export function assertFailsValidationWith(validate, source, ...reasons) {
  return assert.eventually.sameMembers(
    validate(source, []).then((errors) => map(errors, 'reason')),
    reasons,
    `source fails validation with reasons: ${reasons.join(', ')}`
  );
}

export function assertFailsValidationAtLine(validate, source, line) {
  return assert.eventually.include(
    validate(trim(source)).then((errors) => map(errors, 'row')),
    line - 1,
    `source fails validation at line: ${line}`
  );
}
