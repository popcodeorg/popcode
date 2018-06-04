import test from 'tape';

import {getQueryParameters} from '../../../src/util/queryParams';


test('empty querystring', (assert) => {
  const {gistId, snapshotKey, isExperimental} = getQueryParameters('');
  assert.isEqual(gistId, null);
  assert.isEqual(snapshotKey, null);
  assert.isEqual(isExperimental, false);
  assert.end();
});

test('snapshot url', (assert) => {
  const {
    gistId,
    snapshotKey,
    isExperimental,
  } = getQueryParameters('?snapshot=90283083-5951-4af8-bc12-2fe889ea5e4a');
  assert.isEqual(gistId, null);
  assert.isEqual(snapshotKey, '90283083-5951-4af8-bc12-2fe889ea5e4a');
  assert.isEqual(isExperimental, false);
  assert.end();
});


test('experimental url', (assert) => {
  const {
    gistId,
    snapshotKey,
    isExperimental,
  } = getQueryParameters('?experimental');
  assert.isEqual(gistId, null);
  assert.isEqual(snapshotKey, null);
  assert.isEqual(isExperimental, true);
  assert.end();
});

test('gist url', (assert) => {
  const {
    gistId,
    snapshotKey,
    isExperimental,
  } = getQueryParameters('?gist=223f7869fa7dea6089dffd72a38c3286');
  assert.isEqual(gistId, '223f7869fa7dea6089dffd72a38c3286');
  assert.isEqual(snapshotKey, null);
  assert.isEqual(isExperimental, false);
  assert.end();
});
