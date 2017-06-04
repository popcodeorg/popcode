import fs from 'fs';
import path from 'path';

const libraries = {
  jquery: {
    name: 'jQuery',
    javascript: fs.readFileSync(
      path.join(__dirname, '../../bower_components/jquery/dist/jquery.min.js'),
    ),
    predefined: ['$', 'jQuery'],
  },
  lodash: {
    name: 'lodash',
    javascript: fs.readFileSync(
      path.join(__dirname, '../../bower_components/lodash/dist/lodash.min.js'),
    ),
    predefined: ['_'],
  },
  mustache: {
    name: 'Mustache.js',
    javascript: fs.readFileSync(
      path.join(
        __dirname,
        '../../bower_components/mustache.js/mustache.js',
      ),
    ),
    predefined: ['Mustache'],
  },
  bootstrap: {
    name: 'Bootstrap',
    css: fs.readFileSync(
      path.join(
        __dirname,
        '../../bower_components/bootstrap/dist/css/bootstrap.min.css',
      ),
    ),
    javascript: fs.readFileSync(
      path.join(
        __dirname,
        '../../bower_components/bootstrap/dist/js/bootstrap.min.js',
      ),
    ),
  },
};

export default libraries;
