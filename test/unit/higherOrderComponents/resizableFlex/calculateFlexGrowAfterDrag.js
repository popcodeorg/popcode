import test from 'tape';
import almostEqual from 'almost-equal';
import every from 'lodash-es/every';
import zip from 'lodash-es/zip';

import calculateFlexGrowAfterDrag from
  // eslint-disable-next-line max-len
  '../../../../src/higherOrderComponents/resizableFlex/calculateFlexGrowAfterDrag';

function arraysAlmostEqual(array1, array2) {
  return array1.length === array2.length &&
    every(
      zip(array1, array2),
      ([value1, value2]) => almostEqual(value1, value2),
    );
}

function testFlexGrowAfterDrag(description, before, after, expected) {
  test(description, (assert) => {
    const actual = calculateFlexGrowAfterDrag(before, after);
    assert.ok(
      arraysAlmostEqual(actual, expected),
      `Expected flex grow ${expected.join(',')} from previous\
      ${before.currentFlexGrow},${after.currentFlexGrow}; \
      got ${actual.join(',')}`,
    );
    assert.end();
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
