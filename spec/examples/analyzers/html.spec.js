/* eslint-env mocha */
import Immutable from 'immutable';
import Analyzer from '../../../src/analyzers';

describe('Analyzer', () => {
  it('containsExternalScript returns false if the html doesnt contain a script tag', () => {
    const currentProject = new Immutable.Map({
      sources: new Immutable.Map({
        html: '<h1>Some harmless html</h1>'
      })
    });
    const analyzer = new Analyzer(currentProject);
    assert.isFalse(analyzer.containsExternalScript);
  });

  it('containsExternalScript returns true if the html does contain a <script> tag', () => {
    const source = "<script src='https://script.com/script.js'>"
    const currentProject = new Immutable.Map({
      sources: new Immutable.Map({
        html: '<script src="https://script.com/script.js">'
      })
    });
    const analyzer = new Analyzer(currentProject);
    assert.isTrue(analyzer.containsExternalScript);
  });

});
