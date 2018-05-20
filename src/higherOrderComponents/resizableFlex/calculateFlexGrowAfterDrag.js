export default function calculateFlexGrowAfterDrag(
  {
    currentFlexGrow: currentBeforeFlexGrow,
    currentSize: currentBeforeSize,
    desiredSize: desiredBeforeSize,
    initialMainSize: beforeInitialMainSize,
  },
  {
    currentFlexGrow: currentAfterFlexGrow,
    currentSize: currentAfterSize,
    initialMainSize: afterInitialMainSize,
  },
) {
  if (desiredBeforeSize < beforeInitialMainSize) {
    return [currentBeforeFlexGrow, currentAfterFlexGrow];
  }

  const desiredAfterSize = currentBeforeSize + currentAfterSize -
    desiredBeforeSize;
  if (desiredAfterSize < afterInitialMainSize) {
    return [currentBeforeFlexGrow, currentAfterFlexGrow];
  }

  const desiredRatio = desiredBeforeSize /
    (currentBeforeSize + currentAfterSize);
  const totalFlexGrow = currentBeforeFlexGrow + currentAfterFlexGrow;

  const desiredBeforeFlexGrow = totalFlexGrow * desiredRatio;
  const desiredAfterFlexGrow = totalFlexGrow * (1 - desiredRatio);

  return [desiredBeforeFlexGrow, desiredAfterFlexGrow];
}
