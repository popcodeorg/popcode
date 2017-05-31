import test from 'tape';
import Analyzer from '../../src/analyzers';
import buildImmutableProject from '../helpers/buildImmutableProject';

test('no script tag', (assert) => {
  const html = '<h1>Some harmless html</h1>';
  const currentProject = buildImmutableProject({html});
  const analyzer = new Analyzer(currentProject);
  assert.notOk(analyzer.containsExternalScript);
  assert.end();
});

test('<script> tag', (assert) => {
  const currentProject = buildImmutableProject({
    html: '<script src="https://script.com/script.js">',
  });
  const analyzer = new Analyzer(currentProject);
  assert.ok(analyzer.containsExternalScript);
  assert.end();
});

test('libraries', (assert) => {
  const currentProject = buildImmutableProject({html: ''}, ['jquery']);
  const analyzer = new Analyzer(currentProject);
  assert.deepEqual(analyzer.enabledLibraries, ['jquery']);
  assert.end();
});
