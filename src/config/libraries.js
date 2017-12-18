/* eslint-disable import/extensions */

import JQUERY from '../../bower_components/jquery/dist/jquery.min.js';
import LODASH from '../../bower_components/lodash/dist/lodash.min.js';
import MUSTACHE from '../../bower_components/mustache.js/mustache.js';
import BOOTSTRAP_CSS from
  '../../bower_components/bootstrap/dist/css/bootstrap.min.css';
import BOOTSTRAP_JS from
  '../../bower_components/bootstrap/dist/js/bootstrap.min.js';

const libraries = {
  jquery: {
    name: 'jQuery',
    javascript: JQUERY,
    predefined: ['$', 'jQuery'],
  },
  lodash: {
    name: 'lodash',
    javascript: LODASH,
    predefined: ['_'],
  },
  mustache: {
    name: 'Mustache.js',
    javascript: MUSTACHE,
    predefined: ['Mustache'],
  },
  bootstrap: {
    name: 'Bootstrap',
    css: BOOTSTRAP_CSS,
    javascript: BOOTSTRAP_JS,
    dependsOn: ['jquery'],
  },
};

export default libraries;
