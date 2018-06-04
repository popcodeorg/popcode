import test from 'tape';

import Analyzer from '../../src/analyzers';
import {Project} from '../../src/records';

test('no script tag', (assert) => {
  const html = '<h1>Some harmless html</h1>';
  const currentProject = Project.fromJS({sources: {html}}).toJS();
  const analyzer = new Analyzer(currentProject);
  assert.notOk(analyzer.containsExternalScript);
  assert.end();
});

test('<script> tag', (assert) => {
  const currentProject = Project.fromJS({
    sources: {html: '<script src="https://script.com/script.js">'},
  }).toJS();
  const analyzer = new Analyzer(currentProject);
  assert.ok(analyzer.containsExternalScript);
  assert.end();
});

test('libraries', (assert) => {
  const currentProject = Project.fromJS({
    sources: {html: ''},
    enabledLibraries: ['jquery'],
  }).toJS();
  const analyzer = new Analyzer(currentProject);
  assert.deepEqual(analyzer.enabledLibraries, ['jquery']);
  assert.end();
});
