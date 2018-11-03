import {parse} from '@babel/parser';
import traverse from '@babel/traverse';
import {isStringLiteral} from '@babel/types';

export default function getJsSelectorLocations(source) {
  try {
    const ast = parse(source);

    const foundMatches = [];

    const visitor = {
      CallExpression(path) {
        // Only matches jquery or querySelector with string literals
        const expressionLoc = path.node.loc;
        const [selector] = path.node.arguments;
        const callee = path.get('callee').toString();

        if (
          (
            callee === '$' ||
            callee.indexOf('querySelector') !== -1
          ) &&
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
