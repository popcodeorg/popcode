import test from 'tape';

import getCssSelectorLocations from
  '../../../src/util/getCssSelectorLocations';
import {css} from '../../data/acceptance.json';

const [source] = css;

test('finds all selectors in css', (assert) => {
  const selectors = getCssSelectorLocations(source);
  assert.deepEqual(selectors.map(s => s.selector), [
    'body',
    'h1',
    '#name',
    '#job',
    '#fun',
    '#movie',
    '#music',
    '#year',
    '#image',
  ]);
  assert.end();
});
