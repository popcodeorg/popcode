import Validator from '../Validator';

const errorMap = {
  'Unclosed block': (error) => {
    const token = error.source;

    return {
      reason: 'missing-closing-curly',
      payload: {error: token},
      suppresses: ['missing-opening-curly'],
    };
  }
};

class StyleLintValidator extends Validator {
  constructor(source) {
    super(source, 'css', errorMap);
  }

  _getRawErrors() {
    return System.import('../linters').then(({stylelint}) => {

      // Wrap in an object to avoid iterating over properties in _baseForOwn.js
      // return Promise.resolve(stylelint(this._source))
      return Promise.resolve(stylelint(this._source))
        .then(
          (result) => {
            console.log(result.output);
            return {result};
          })
        .catch(
          (syntaxError) => {
            console.log(syntaxError);
            return {syntaxError};
          }
      );

      // return Promise.resolve(stylelint(currentSource))
      //   .then((result) => {
      //     console.log(result.output);
      //     // Wrap in an object to avoid iterating over properties in _baseForOwn.js
      //     return {result};
      //   })
      //   .catch(
      //     (syntaxError) => {
      //       console.log(syntaxError);
      //       // Wrap in an object to avoid iterating over properties in _baseForOwn.js
      //       return {syntaxError};
      //     }
      //   );
      // try {
      //   stylelint("a { color: pink; ")
      //     .then((result) => console.log(result.output))
      //     .catch(
      //       (syntaxError) => {
      //         console.log(syntaxError);
      //         return syntaxError;
      //       }
      //     );
      //   return [];
      // } catch (_e) {
      //   return [];
      // }
    });
  }

  _keyForError(error) {
    // On Syntax Errors
    if (error.reason) {
      return error.reason;
    }
  }

  _locationForError(error) {
    if (!error.token) {
      return {row: 0, column: 0};
    }
    return {row: error.token.line - 1, column: error.token.charNum - 1};
  }
}

export default (source) => new StyleLintValidator(source).getAnnotations();
