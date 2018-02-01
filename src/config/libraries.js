export default {
  jquery: {
    name: 'jQuery',
    predefined: ['$', 'jQuery'],
  },
  lodash: {
    name: 'lodash',
    predefined: ['_'],
  },
  mustache: {
    name: 'Mustache.js',
    predefined: ['Mustache'],
  },
  bootstrap: {
    name: 'Bootstrap',
    dependsOn: ['jquery'],
  },
};
