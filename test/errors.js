/* eslint-env mocha */

import './util/setup';
import $renderApplication from './util/renderApplication';
import $ from 'jquery';
import {expect} from 'chai';
import {updateHTMLBody} from './util/helpers';
import deferImmediate from './util/deferImmediate';

describe.only('errors', () => {
  let $application, $ui;

  beforeEach(() => {
    $application = $renderApplication();
    $ui = $($application.nodes());
  });

  it('should add an error when I make a mistake', () => {
    updateHTMLBody($application, '<div id=test></div>');
    return expect(deferImmediate().then(
      () => $ui.find('.errorList-error').length
    )).to.eventually.equal(1);
  });
});

