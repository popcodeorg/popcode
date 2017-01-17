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

export function assertFailsValidation(validate,
    source,
    options = {validatorArgs: [], reasons: []}
  ) {
  return assert.eventually.sameMembers(
    validate(source, ...options.validatorArgs).then(
      (errors) => map(errors, 'reason')),
      options.reasons,
      `source fails validation with reasons: ${options.reasons.join(', ')}`
  );
}

export function assertFailsValidationWith(validate, source, ...reasons) {
  const options = {
    reasons,
    validatorArgs: [],
  };
  return assertFailsValidation(validate, source, options);
}

export function assertFailsValidationAtLine(validate, source, line) {
  return assert.eventually.include(
    validate(trim(source)).then((errors) => map(errors, 'row')),
    line - 1,
    `source fails validation at line: ${line}`
  );
}
