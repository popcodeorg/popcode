/* eslint-env mocha */

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import Application from '../src/components/Application';
import {expect} from 'chai';
import $R from './util/rquery';

describe('toolbar', () => {
  let $application;

  beforeEach(() => {
    $application = $R(TestUtils.renderIntoDocument(<Application/>));
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
