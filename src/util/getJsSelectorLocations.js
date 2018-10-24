import {parse} from '@babel/parser';
import traverse from '@babel/traverse';
import {isStringLiteral} from '@babel/types';

export default function getJsSelectorLocations(source) {
  try {
    const ast = parse(source);

    const foundMatches = [];

    const visitor = {
      CallExpression(path) {
        // Only matches code of the form $('selector')
        const expressionLoc = path.node.loc;
        const [selector] = path.node.arguments;
        if (
          path.get('callee').toString() === '$' &&
          isStringLiteral(selector)
        ) {
          foundMatches.push({
            loc: expressionLoc,
            selector: selector.value,
          });
        }
      },
    };
    traverse(ast, visitor, null);

    return foundMatches;
  } catch (e) {
    return null;
  }
}
