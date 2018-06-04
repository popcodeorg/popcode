import acceptance from '../data/acceptance.json';

import validationTest from './validationTest';

export default function testValidatorAcceptance(validator, language) {
  return (t) => {
    acceptance[language].forEach(
      source => t.test(validationTest(source, validator)),
    );
  };
}
