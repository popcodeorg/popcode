import test from 'tape';
import Analyzer from '../../src/analyzers';
import {project as buildProject} from '../helpers/factory';

test('no script tag', (assert) => {
  const html = '<h1>Some harmless html</h1>';
  const currentProject = buildProject({sources: {html}});
  const analyzer = new Analyzer(currentProject);
  assert.notOk(analyzer.containsExternalScript);
  assert.end();
});

test('<script> tag', (assert) => {
  const currentProject = buildProject({
    sources: {html: '<script src="https://script.com/script.js">'},
  });
  const analyzer = new Analyzer(currentProject);
  assert.ok(analyzer.containsExternalScript);
  assert.end();
});

test('libraries', (assert) => {
  const currentProject = buildProject({
    sources: {html: ''},
    enabledLibraries: ['jquery'],
  });
  const analyzer = new Analyzer(currentProject);
  assert.deepEqual(analyzer.enabledLibraries, ['jquery']);
  assert.end();
});
