/* eslint-env mocha */

import './setup';
import $renderApplication from './util/renderApplication';
import {expect} from 'chai';

describe('toolbar', () => {
  let $application;

  beforeEach(() => {
    $application = $renderApplication();
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
});
