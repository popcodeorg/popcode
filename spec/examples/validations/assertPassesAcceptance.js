/* eslint-env mocha */

import acceptance from './acceptance.json';
import {assertPassesValidation} from '../../assertions/validations';

export default function assertPassesAcceptance(
  validator, language, ...validatorArgs
) {
  acceptance[language].forEach((source) =>
    it(`generates no errors for known good ${language} \n${source}`, () =>
      assertPassesValidation(validator, source, validatorArgs)
    )
  );
}
