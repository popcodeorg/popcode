export default function selectorAtCursor(selectors, cursor) {
  if (!selectors) {
    return null;
  }
  const matchingSelector = selectors.find(({loc, selector}) => {
    const cursorRow = cursor.row + 1;
    if (cursorRow >= loc.start.line && cursorRow <= loc.end.line) {
      return selector;
    }
    return false;
  });
  return matchingSelector ? matchingSelector.selector : null;
}
