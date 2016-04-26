import fs from 'fs';
import path from 'path';

const libraries = {
  jquery: {
    name: 'jQuery',
    javascript: fs.readFileSync(
      path.join(__dirname, '../../bower_components/jquery/dist/jquery.min.js'),
      'utf8'
    ),
    validations: {javascript: {jquery: {$set: true}}},
  },
  lodash: {
    name: 'lodash',
    javascript: fs.readFileSync(
      path.join(__dirname, '../../bower_components/lodash/dist/lodash.min.js'),
      'utf8'
    ),
    validations: {javascript: {predef: {$push: ['_']}}},
  },
  underscore: {
    name: 'Underscore.js',
    javascript: fs.readFileSync(
      path.join(
        __dirname,
        '../../bower_components/underscore/underscore-min.js'
      ),
      'utf8'
    ),
    validations: {javascript: {predef: {$push: ['_']}}},
  },
  angular: {
    name: 'AngularJS',
    javascript: fs.readFileSync(
      path.join(__dirname, '../../bower_components/angular/angular.min.js'),
      'utf8'
    ),
    validations: {javascript: {predef: {$push: ['angular']}}},
  },
  react: {
    name: 'React',
    javascript: [
      fs.readFileSync(
        path.join(__dirname, '../../bower_components/react/react.min.js'),
        'utf8'
      ),
      fs.readFileSync(
        path.join(__dirname, '../../bower_components/react/react-dom.min.js'),
        'utf8'
      ),
    ],
    validations: {javascript: {predef: {$push: ['React']}}},
  },
  ember: {
    name: 'Ember.js',
    javascript: fs.readFileSync(
      path.join(__dirname, '../../bower_components/ember/ember.min.js'),
      'utf8'
    ),
    validations: {javascript: {predef: {$push: ['Ember']}}},
  },
  bootstrap: {
    name: 'Bootstrap',
    css: fs.readFileSync(
      path.join(
        __dirname,
        '../../bower_components/bootstrap/dist/css/bootstrap.min.css'
      ),
      'utf8'
    ),
    javascript: fs.readFileSync(
      path.join(
        __dirname,
        '../../bower_components/bootstrap/dist/js/bootstrap.min.js'
      ),
      'utf8'
    ),
  },
  foundation: {
    name: 'Foundation',
    css: fs.readFileSync(
      path.join(
        __dirname,
        '../../bower_components/foundation/css/foundation.min.css'
      ),
      'utf8'
    ),
    javascript: fs.readFileSync(
      path.join(
        __dirname,
        '../../bower_components/foundation/js/foundation.min.js'
      ),
      'utf8'
    ),
  },
  normalize: {
    name: 'normalize.css',
    css: fs.readFileSync(
      path.join(
        __dirname,
        '../../bower_components/normalize-css/normalize.css'
      ),
      'utf8'
    ),
  },
};

export default libraries;
