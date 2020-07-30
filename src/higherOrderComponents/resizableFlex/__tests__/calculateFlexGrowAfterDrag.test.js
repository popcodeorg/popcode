import calculateFlexGrowAfterDrag from '../calculateFlexGrowAfterDrag';

function testFlexGrowAfterDrag(description, before, after, expected) {
  test(description, () => {
    const actual = calculateFlexGrowAfterDrag(before, after);
    expect(expected).toHaveAlmostEqualElements(actual);
  });
}

testFlexGrowAfterDrag(
  'valid drag from defaults',
  {
    currentFlexGrow: 1,
    currentSize: 100,
    desiredSize: 110,
    initialMainSize: 10,
  },
  {
    currentFlexGrow: 1,
    currentSize: 100,
    initialMainSize: 10,
  },
  [1.1, 0.9],
);

testFlexGrowAfterDrag(
  'valid drag from non-default flex',
  {
    currentFlexGrow: 1.1,
    currentSize: 110,
    desiredSize: 120,
    initialMainSize: 10,
  },
  {
    currentFlexGrow: 0.9,
    currentSize: 90,
    initialMainSize: 10,
  },
  [1.2, 0.8],
);

testFlexGrowAfterDrag(
  'drag that would make before region too small',
  {
    currentFlexGrow: 0.1,
    currentSize: 10,
    desiredSize: 9,
    initialMainSize: 10,
  },
  {
    currentFlexGrow: 1.9,
    currentSize: 190,
    initialMainSize: 10,
  },
  [0.1, 1.9],
);

testFlexGrowAfterDrag(
  'drag that would make after region too small',
  {
    currentFlexGrow: 1.9,
    currentSize: 190,
    desiredSize: 191,
    initialMainSize: 10,
  },
  {
    currentFlexGrow: 0.1,
    currentSize: 10,
    initialMainSize: 10,
  },
  [1.9, 0.1],
);
