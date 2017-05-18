export function getNodeWidth(node) {
  const minWidth = window.getComputedStyle(node).minWidth;
  return {
    width: node.offsetWidth,
    minWidth: parseInt(minWidth.replace('px', ''), 10),
  };
}

export function getNodeWidths(refs) {
  return refs.map(node => node ? getNodeWidth(node) : null);
}

export function getNodeHeights(refs) {
  return refs.map((node) => {
    if (node) {
      const minHeight = window.getComputedStyle(node).minHeight;
      return {
        height: node.offsetHeight,
        minHeight: parseInt(minHeight.replace('px', ''), 10),
      };
    }
    return null;
  });
}

function isSecondDividerPushingFirstDivider(
  [
    {size: size0, minSize: contentMinSize0},
    {size: size1, minSize: contentMinSize1},
  ],
  deltaPosition,
) {
  return size0 > contentMinSize0 &&
    size1 === contentMinSize1 &&
    deltaPosition < 0;
}

function constrainPosition(
  [,, {size, minSize}],
  lastPosition,
  deltaPosition,
  offset,
) {
  const maxDeltaY = size - minSize;
  return lastPosition + Math.min(deltaPosition, maxDeltaY) - offset;
}

function columnToContent(column) {
  return column ? {size: column.width, minSize: column.minWidth} : null;
}

function editorToContent(editor) {
  return editor ? {size: editor.height, minSize: editor.minHeight} : null;
}

export function updateEditorColumnFlex({
  index,
  dividerHeights,
  editorHeights,
  deltaY,
  lastY,
  y,
}) {
  return updateFlex({
    index,
    contentSizes: editorHeights.map(editorToContent),
    dividerSizes: dividerHeights.map(editorToContent),
    deltaPosition: deltaY,
    lastPosition: lastY,
    position: y,
  });
}

export function updateWorkspaceRowFlex({
  columnWidths,
  dividerWidth,
  deltaX,
  lastX,
  x,
}) {
  return updateFlex({
    index: 0,
    contentSizes: columnWidths.map(columnToContent),
    dividerSizes: [columnToContent(dividerWidth)],
    deltaPosition: deltaX,
    lastPosition: lastX,
    position: x,
  });
}

function updateFlex({
  deltaPosition,
  dividerSizes: [{minSize: dividerMinSize0}],
  contentSizes,
  index,
  lastPosition,
  position,
}) {
  const [
    {size: contentSize0},
    {size: contentSize1},
  ] = contentSizes;
  const contentSize2 = contentSizes[2] ? contentSizes[2].size : 0;

  if (index === 0) {
    return [
      `0 1 ${position}px`,
      '1',
      contentSize2 ? `0 1 ${contentSize2}px` : '1',
    ];
  }
  const distanceToTopOfContent1 = dividerMinSize0 + contentSize0;
  const projectedSizeOfContent1 = position - distanceToTopOfContent1;
  const contentMinSize2 = contentSizes[2].minSize;
  if (
    isSecondDividerPushingFirstDivider(contentSizes, deltaPosition)
  ) {
    return [
      `0 1 ${contentSize0 + deltaPosition}px`,
      `0 1 ${projectedSizeOfContent1}px`,
      '1',
    ];
  } else if (contentSize2 > contentMinSize2) {
    const constrainedSizeOfContent1 = constrainPosition(
      contentSizes,
      lastPosition,
      deltaPosition,
      distanceToTopOfContent1,
    );
    return [
      `0 1 ${contentSize0}px`,
      `0 1 ${constrainedSizeOfContent1}px`,
      '1',
    ];
  } else if (deltaPosition < 0 && projectedSizeOfContent1 <= contentSize1) {
    return [
      `0 1 ${contentSize0}px`,
      `0 1 ${projectedSizeOfContent1}px`,
      '1',
    ];
  }
  return null;
}
