/* eslint-env mocha */
import Analyzer from '../../../src/analyzers';
import {assert} from 'chai';
import buildImmutableProject from '../../helpers/buildImmutableProject';

describe('Analyzer', () => {
  it('containsExternalScript is false if no script tag', () => {
    const html = '<h1>Some harmless html</h1>';
    const currentProject = buildImmutableProject({html});
    const analyzer = new Analyzer(currentProject);
    assert.isNotOk(analyzer.containsExternalScript);
  });

  it('containsExternalScript is true if <script> tag', () => {
    const currentProject = buildImmutableProject({html: '<script src="https://script.com/script.js">'});
    const analyzer = new Analyzer(currentProject);
    assert.isOk(analyzer.containsExternalScript);
  });

  it('enabledLibraries returns an array of the enabled libraries', () => {
    const currentProject = buildImmutableProject({html: ''}, ['jquery']);
    const analyzer = new Analyzer(currentProject);
    assert.deepEqual(analyzer.enabledLibraries, ['jquery']);
  });
});
