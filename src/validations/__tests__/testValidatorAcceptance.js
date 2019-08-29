import acceptance from './acceptance.json';

import validationTest from './validationHelper';

export default function testValidatorAcceptance(validator, language) {
  test.each(acceptance[language])('Acceptance - %i', source =>
    validationTest(source, validator),
  );
}
