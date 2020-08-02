import {getQueryParameters} from '../queryParams';

test('empty querystring', () => {
  const {gistId, snapshotKey, isExperimental} = getQueryParameters('');
  expect(gistId).toBeNull();
  expect(snapshotKey).toBeNull();
  expect(isExperimental).toBe(false);
});

test('snapshot url', () => {
  const {gistId, snapshotKey, isExperimental} = getQueryParameters(
    '?snapshot=90283083-5951-4af8-bc12-2fe889ea5e4a',
  );
  expect(gistId).toBeNull();
  expect(snapshotKey).toEqual('90283083-5951-4af8-bc12-2fe889ea5e4a');
  expect(isExperimental).toBe(false);
});

test('experimental url', () => {
  const {gistId, snapshotKey, isExperimental} = getQueryParameters(
    '?experimental',
  );
  expect(gistId).toBeNull();
  expect(snapshotKey).toBeNull();
  expect(isExperimental).toBe(true);
});

test('gist url', () => {
  const {gistId, snapshotKey, isExperimental} = getQueryParameters(
    '?gist=223f7869fa7dea6089dffd72a38c3286',
  );
  expect(gistId).toEqual('223f7869fa7dea6089dffd72a38c3286');
  expect(snapshotKey).toBeNull();
  expect(isExperimental).toBe(false);
});
