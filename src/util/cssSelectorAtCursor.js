import postcss from 'postcss';

export function cssSelectorAtCursor(source, cursor) {
  let highlighterSelector = '';
  try {
    const root1 = postcss.parse(source);
    root1.walkRules((rule) => {
      console.log(rule);
      const ruleStartRow = rule.source.start.line;
      const ruleStartCol = rule.source.start.column;
      const ruleEndRow = rule.source.end.line;
      const ruleEndCol = rule.source.end.column;
      const cursorRow = cursor.row + 1;
      const cursorCol = cursor.column + 1;
      if ((cursorRow > ruleStartRow && cursorRow < ruleEndRow) ||
        (cursorRow === ruleStartRow && cursorCol > ruleStartCol) ||
        (cursorRow === ruleEndRow && cursorCol <= ruleEndCol)) {
        highlighterSelector = rule.selector;
      }
    });
    return highlighterSelector;
  } catch (e) {
    return highlighterSelector;
  }
}
