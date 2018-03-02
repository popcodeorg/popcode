import postcss from 'postcss';

export function selectorAtCursor(source, cursor, language) {
  let highlighterSelector = null;
  if (language === 'css') {
    try {
      const rootNode = postcss.parse(source);
      rootNode.walkRules((rule) => {
        const ruleStartRow = rule.source.start.line;
        const ruleStartCol = rule.source.start.column;
        const ruleEndRow = rule.source.end.line;
        const ruleEndCol = rule.source.end.column;
        const cursorRow = cursor.row + 1;
        const cursorCol = cursor.column + 1;
        if (
          (cursorRow > ruleStartRow && cursorRow < ruleEndRow) ||
          (cursorRow === ruleStartRow && cursorCol >= ruleStartCol) ||
          (cursorRow === ruleEndRow && cursorCol <= ruleEndCol)
        ) {
          highlighterSelector = rule.selector;
          return false;
        }
        return null;
      });
      return highlighterSelector;
    } catch (e) {
      return null;
    }
  }
  return null;
}
