import React from 'react';
import Application from '../../src/components/Application';
import TestUtils from 'react-addons-test-utils';
import $R from './rquery';

export default () => $R(TestUtils.renderIntoDocument(<Application/>));
