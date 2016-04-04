/* eslint-env mocha */

import './util/setup';
import {expect} from 'chai';
import $renderApplication from './util/renderApplication';
import $ from 'jquery';
import {logIn} from './util/helpers';
import afterImmediate from './util/afterImmediate';

describe('toolbar', () => {
  let $application, $ui;

  beforeEach(() => {
    $application = $renderApplication();
    $ui = $($application.nodes());
  });

  describe('clicking show/hide bar', () => {
    beforeEach(() => {
      $application.find('.toolbar-showHide').click();
    });

    it('should open toolbar', () => {
      expect($application.find('.toolbar-menu--open')).to.have.length(1);
    });

    describe('then clicking it again', () => {
      beforeEach(() => {
        $application.find('.toolbar-showHide').click();
      });

      it('should close toolbar', () => {
        expect($application.find('.toolbar-menu--closed')).to.have.length(1);
      });
    });
  });

  describe('new project button', () => {
    before(() => {
      $application.find('.toolbar-showHide').click();
    });

    it('should not be visible when logged out', () => {
      expect($ui.find(':contains("New Project")')).to.have.length(0);
    });

    it('should be visible when logged in', () => {
      logIn();
      return expect(afterImmediate(
        () => $ui.find('.toolbar-menu-item:contains("New Project")').length
      )).to.eventually.equal(1);
    });
  });
});
