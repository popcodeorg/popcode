/* eslint-env mocha */

import {assertPassesValidation} from '../../assertions/validations';
import acceptance from './acceptance.json';

export default function assertPassesAcceptance(
  validator, language, ...validatorArgs
) {
  acceptance[language].forEach(source =>
    it(`generates no errors for known good ${language} \n${source}`, () =>
      assertPassesValidation(validator, source, validatorArgs),
    ),
  );
}
