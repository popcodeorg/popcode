/* eslint-env mocha */

import './setup';
import $renderApplication from './util/renderApplication';
import $ from 'jquery';
import {expect} from 'chai';
import {updateSource, updateHTMLBody, parsedPreview} from './util/helpers';

describe('editor', () => {
  let $application;

  beforeEach(() => {
    $application = $renderApplication();
  });

  it('should update the preview when I add to the HTML source', () => {
    updateHTMLBody($application, '<div id="test"></div>');
    expect($(parsedPreview($application)).find('#test')).
      to.have.length(1);
  });

  it('should update the preview when I add to the CSS source', () => {
    const css = 'p { }';
    updateSource($application, 'css', css);
    expect($(parsedPreview($application)).find('style')).to.
      include.something.that.satisfy(($css) => $css.text() === css);
  });
});
