import {Promise} from 'es6-promise';
import flatten from 'lodash/flatten';
import validateWithCss from './css/css.js';
import validateWithPrettyCSS from './css/prettycss.js';

export default source => Promise.all([
  validateWithCss(source),
  validateWithPrettyCSS(source),
]).then(results => flatten(results));
