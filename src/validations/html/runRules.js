import SAXParser from 'parse5-sax-parser';
import voidElements from 'void-elements';

// Runs `rules` on `source` and promises an iterable of all errors.
//
// `rules` must be an array of objects that satisfy the interface:
// * done() returns an iterable of errors
// * optionally,
//   openTag({row: number, column: number}, {name: string})
//   to take in open tags that are neither void nor self-closing
// * optionally,
//   closeTag({row: number, column: number}, name: string)
//   to take in close tags
export default (rules, source) => {
  const parser = new SAXParser({sourceCodeLocationInfo: true});
  return new Promise((resolve) => {
    parser.on(
      'startTag',
      ({
        tagName,
        selfClosing,
        sourceCodeLocation: {startLine, startCol},
      }) => {
        for (const rule of rules) {
          if (rule.openTag && !selfClosing && !(tagName in voidElements)) {
            rule.openTag(
              {row: startLine - 1, column: startCol - 1},
              {name: tagName},
            );
          }
        }
      },
    );
    parser.on(
      'endTag',
      ({tagName, sourceCodeLocation: {startLine, startCol}}) => {
        for (const rule of rules) {
          if (rule.closeTag) {
            rule.closeTag({row: startLine - 1, column: startCol - 1}, tagName);
          }
        }
      },
    );
    parser.write(source);
    parser.end(() => {
      resolve(function* () {
        for (const rule of rules) {
          yield* rule.done();
        }
      }());
    });
  });
};
