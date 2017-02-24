import {assert} from 'chai';
import map from 'lodash/map';
import trim from 'lodash/trim';

export function assertPassesValidation(validate, source, validatorArgs = []) {
  return assert.eventually.deepEqual(
    validate(source, ...validatorArgs),
    [],
    'source passes validation',
  );
}

export async function assertFailsValidation(validate,
    source,
    options = {validatorArgs: [], reasons: []},
  ) {
  const errors = await validate(source, ...options.validatorArgs);
  assert.sameMembers(
    map(errors, 'reason'),
    options.reasons,
    `source fails validation with reasons: ${options.reasons.join(', ')}`,
  );
}

export function assertFailsValidationWith(validate, source, ...reasons) {
  const options = {
    reasons,
    validatorArgs: [],
  };
  return assertFailsValidation(validate, source, options);
}

export async function assertFailsValidationAtLine(validate, source, line) {
  const errors = await validate(trim(source));
  assert.include(
    map(errors, 'row'),
    line - 1,
    `source fails validation at line: ${line}`,
  );
}
