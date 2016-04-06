import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import rquery from 'rquery';
import lodash from 'lodash';

export default rquery(lodash, React, ReactDOM, TestUtils);
