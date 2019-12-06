import validateSource from '../../helpers/validateSource';
import {validatedSource} from '../../../actions/errors';

const mockValidationErrors = {
  css: 'invalid CSS selector',
};

const mockCssValidate = jest.fn(x => mockValidationErrors);

jest.mock('../../../util/retryingFailedImports', () =>
  jest.fn(x => ({
    css: mockCssValidate,
  })),
);

const mockActionCreator = (language, errors) => ({
  type: 'VALIDATED_SOURCE',
  payload: {
    errors: {
      [language]: errors[language],
      language,
    },
  },
});

jest.mock('../../../actions/errors', () => ({
  validatedSource: jest.fn((language, errors) =>
    mockActionCreator(language, errors),
  ),
}));

test('calls validateSource with validationErrors', async () => {
  const language = 'css';
  const source = 'dib { color: green;}';
  const projectAttributes = {};
  const dispatch = jest.fn();
  await validateSource({language, source, projectAttributes}, dispatch);
  expect(mockCssValidate).toHaveBeenCalledWith(source, projectAttributes);
  expect(validatedSource).toHaveBeenCalledWith(language, mockValidationErrors);
  const payload = validatedSource(language, mockValidationErrors);
  expect(dispatch).toHaveBeenCalledWith(payload);
});
