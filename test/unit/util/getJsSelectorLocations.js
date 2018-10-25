import test from 'tape';

import getJsSelectorLocations from
  '../../../src/util/getJsSelectorLocations';
import {javascript} from '../../data/acceptance.json';

const [source] = javascript;

test('finds all selectors in js', (assert) => {
  const selectors = getJsSelectorLocations(source);
  assert.deepEqual(selectors.map(s => s.selector), [
    '#submit-name',
    '#greeting',
    '#name',
    '#change-color',
    'body',
    '#pic1',
    '#gallery-main',
    '#pic2',
    '#gallery-main',
    '#pic3',
    '#gallery-main',
  ]);
  assert.end();
});
