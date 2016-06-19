import JQUERY from 'raw!../../bower_components/jquery/dist/jquery.min.js';
import LODASH from 'raw!../../bower_components/lodash/dist/lodash.min.js';
import UNDERSCORE from
  'raw!../../bower_components/underscore/underscore-min.js';
import ANGULAR from 'raw!../../bower_components/angular/angular.min.js';
import REACT from 'raw!../../bower_components/react/react.min.js';
import REACT_DOM from 'raw!../../bower_components/react/react-dom.min.js';
import EMBER from 'raw!../../bower_components/ember/ember.min.js';
import BOOTSTRAP_CSS from
  'raw!../../bower_components/bootstrap/dist/css/bootstrap.min.css';
import BOOTSTRAP_JS from
  'raw!../../bower_components/bootstrap/dist/js/bootstrap.min.js';
import FOUNDATION_CSS from
  'raw!../../bower_components/foundation/css/foundation.min.css';
import FOUNDATION_JS from
  'raw!../../bower_components/foundation/js/foundation.js';
import NORMALIZE from 'raw!../../bower_components/normalize-css/normalize.css';

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
  underscore: {
    name: 'Underscore.js',
    javascript: UNDERSCORE,
    predefined: ['_'],
  },
  mustache: {
    name: 'Mustache.js',
    javascript: fs.readFileSync(
      path.join(
        __dirname,
        '../../bower_components/mustache.js/mustache.js'
      )
    ),
    predefined: ['Mustache'],
  },
  handlebars: {
    name: 'Handlebars.js',
    javascript: fs.readFileSync(
      path.join(
        __dirname,
        '../../bower_components/handlebars/handlebars.js'
      )
    ),
    predefined: ['Handlebars'],
  },
  angular: {
    name: 'AngularJS',
    javascript: ANGULAR,
    predefined: ['angular'],
  },
  react: {
    name: 'React',
    javascript: [REACT, REACT_DOM],
    predefined: ['React'],
  },
  ember: {
    name: 'Ember.js',
    javascript: EMBER,
    predefined: ['Ember'],
  },
  bootstrap: {
    name: 'Bootstrap',
    css: BOOTSTRAP_CSS,
    javascript: BOOTSTRAP_JS,
  },
  foundation: {
    name: 'Foundation',
    css: FOUNDATION_CSS,
    javascript: FOUNDATION_JS,
  },
  normalize: {
    name: 'normalize.css',
    css: NORMALIZE,
  },
};

export default libraries;
