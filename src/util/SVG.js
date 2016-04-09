/* eslint global-require: 0 */
import React from 'react';
import config from '../config';

let Wordmark, WordmarkVertical;

class StubComponent extends React.Component {
  render() {
    return <img/>;
  }
}

if (config.stubSVGs) {
  Wordmark = StubComponent;
  WordmarkVertical = StubComponent;
} else {
  Wordmark = require('../../static/images/wordmark.svg');
  WordmarkVertical = require('../../static/images/wordmark-vertical.svg');
}

export {
  Wordmark,
  WordmarkVertical,
};
