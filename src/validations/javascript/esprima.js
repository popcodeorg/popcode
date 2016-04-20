import i18n from 'i18next-client';
import esprima from 'esprima';
import find from 'lodash/find';

const humanErrors = {
  'Unexpected string': (error, token) => i18n.t(
    'errors.javascript.unexpected-string',
    {value: token.value}
  ),

  'Unexpected number': (error, token) => i18n.t(
    'errors.javascript.unexpected-number',
    {value: token.value}
  ),

  'Invalid left-hand side in assignment': (error, token) => {
    let message;
    switch (token.type) {
      case 'String':
        message = 'invalid-left-hand-string';
        break;
      case 'Numeric':
        message = 'invalid-left-hand-number';
        break;
      case 'Boolean':
        message = 'invalid-left-hand-boolean';
        break;
      default:
        message = 'invalid-left-hand-value';
        break;
    }
    return i18n.t(
      `errors.javascript.${message}`,
      {value: token.value}
    );
  },
};

function findTokenForError(error, tokens) {
  return find(tokens, (token) => {
    const startLocation = token.loc.start;
    const endLocation = token.loc.end;
    return startLocation.line === error.lineNumber &&
      startLocation.column <= error.column - 1 &&
      endLocation.column >= error.column - 1;
  });
}

function convertErrorToAnnotation(error, token) {
  const description = error.description;
  if (humanErrors.hasOwnProperty(description)) {
    const message = humanErrors[description](error, token);
    return {
      row: error.lineNumber - 1, column: error.column - 1,
      raw: message,
      text: message,
      type: 'error',
    };
  } else {
    console.debug('no message', error, token);
  }
  return undefined;
}

export default (source) => {
  const annotations = [];

  try {
    esprima.parse(source);
  } catch (error) {
    try {
      const tokens = esprima.tokenize(source, {loc: true});
      const token = findTokenForError(error, tokens);
      if (token) {
        const annotation = convertErrorToAnnotation(error, token);
        if (annotation) {
          annotations.push(annotation);
        }
      } else {
        console.debug('no token', error, tokens);
      }
    } catch (tokenizeError) {
      console.debug('tokenize error', tokenizeError);
    }
  }

  return Promise.resolve(annotations);
};
