import SAXParser from 'parse5/lib/sax';
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
  const parser = new SAXParser({locationInfo: true});
  return new Promise((resolve) => {
    parser.on('startTag', (name, attrs, selfClosing, {line, col}) => {
      for (const rule of rules) {
        if (rule.openTag && !selfClosing && !(name in voidElements)) {
          rule.openTag({row: line - 1, column: col - 1}, {name});
        }
      }
    });
    parser.on('endTag', (name, {line, col}) => {
      for (const rule of rules) {
        if (rule.closeTag) {
          rule.closeTag({row: line - 1, column: col - 1}, name);
        }
      }
    });
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
