/* eslint-env mocha */

import analyzers from '../../../src/analyzers';

describe('html', () => {
  it('should return OVERRIDE_JSHINT_W117 with enabled=true if the html does not contain a <script> tag', () => {
    const analyze = analyzers['html'];
    const source = "<h1>Some harmless html</h1>"
    assert.eventually.deepEqual(analyze(source), {
      actionName: "OVERRIDE_JSHINT_W117",
      payload: {
        enabled: true
      }
    })
  });

  it('should return OVERRIDE_JSHINT_W117 with enabled=false if the html does contain a <script> tag', () => {
    const analyze = analyzers['html'];
    const source = "<script src='https://script.com/script.js'>"
    assert.eventually.deepEqual(analyze(source), {
      actionName: "OVERRIDE_JSHINT_W117",
      payload: {
        enabled: false
      }
    })
  });

});
