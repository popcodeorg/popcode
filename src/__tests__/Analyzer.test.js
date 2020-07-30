import Analyzer from '../analyzers';
import {Project} from '../records';

test('no script tag', () => {
  const html = '<h1>Some harmless html</h1>';
  const currentProject = Project.fromJS({sources: {html}}).toJS();
  const analyzer = new Analyzer(currentProject);
  expect(analyzer.containsExternalScript).toBeFalsy();
});

test('<script> tag', () => {
  const currentProject = Project.fromJS({
    sources: {html: '<script src="https://script.com/script.js">'},
  }).toJS();
  const analyzer = new Analyzer(currentProject);
  expect(analyzer.containsExternalScript).toBeTruthy();
});

test('libraries', () => {
  const currentProject = Project.fromJS({
    sources: {html: ''},
    enabledLibraries: ['jquery'],
  }).toJS();
  const analyzer = new Analyzer(currentProject);
  expect(analyzer.enabledLibraries).toEqual(['jquery']);
});
