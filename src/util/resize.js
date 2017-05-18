function isSecondDividerPushingUpFirstDivider(
  [
    {height: height0, minHeight: editorMinHeight0},
    {height: height1, minHeight: editorMinHeight1},
  ],
  deltaY,
) {
  return height0 > editorMinHeight0 &&
    height1 === editorMinHeight1 &&
    deltaY < 0;
}

function constrainY([,, {height, minHeight}], lastY, deltaY, offset) {
  const maxDeltaY = height - minHeight;
  return lastY + Math.min(deltaY, maxDeltaY) - offset;
}

export function updateVerticalFlex({
  deltaY,
  dividerHeights: [{minHeight: dividerMinHeight0}],
  editorHeights,
  index,
  lastY,
  y,
}) {
  const [
    {height: editorHeight0},
    {height: editorHeight1},
    {height: editorHeight2, minHeight: editorMinHeight2},
  ] = editorHeights;
  if (index === 0) {
    return [
      `0 1 ${y}px`,
      '1',
      editorHeight2 ? `0 1 ${editorHeight2}px` : '1',
    ];
  }
  const distanceToTopOfEditor1 = dividerMinHeight0 + editorHeight0;
  const projectedHeightOfEditor1 = y - distanceToTopOfEditor1;
  if (
    isSecondDividerPushingUpFirstDivider(editorHeights, deltaY)
  ) {
    return [
      `0 1 ${editorHeight0 + deltaY}px`,
      `0 1 ${projectedHeightOfEditor1}px`,
      '1',
    ];
  } else if (editorHeight2 > editorMinHeight2) {
    const constrainedHeightOfEditor1 =
      constrainY(editorHeights, lastY, deltaY, distanceToTopOfEditor1);
    return [
      `0 1 ${editorHeight0}px`,
      `0 1 ${constrainedHeightOfEditor1}px`,
      '1',
    ];
  } else if (deltaY < 0 && projectedHeightOfEditor1 <= editorHeight1) {
    return [
      `0 1 ${editorHeight0}px`,
      `0 1 ${projectedHeightOfEditor1}px`,
      '1',
    ];
  }
  return null;
}
