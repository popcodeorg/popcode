/* eslint-env mocha */

import jsdom from 'jsdom';
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import chaiThings from 'chai-things';
import chaiAsPromised from 'chai-as-promised';
import 'chai-react';
import proxyquire from 'proxyquire';
import {DOMParser} from 'xmlshim';
import wrap from 'lodash/wrap';
import mockFirebase from './mockFirebase';
import initI18n from '../../src/util/initI18n';

chai.use(chaiAsPromised);
chai.use(dirtyChai);
chai.use(chaiThings);

proxyquire('../../src/services/appFirebase', {
  firebase() {
    return mockFirebase;
  },
});

initI18n();

beforeEach(() => {
  mockFirebase.autoFlush(true);
});

if (!('document' in global)) {
  global.document = jsdom.jsdom(
    '<!doctype html5><html><body></body></html>',
    {url: 'https://popcode.org'}
  );
  global.window = document.defaultView;
  window.DOMParser = DOMParser;

  DOMParser.prototype.parseFromString = wrap(
    DOMParser.prototype.parseFromString,
    (originalParseFromString, html) => {
      if (!html) {
        return originalParseFromString('<html></html>');
      }
      return originalParseFromString(html.replace(/^<!doctype html>/i, ''));
    }
  );

  for (const key in window) {
    if (window.hasOwnProperty(key) && !(key in global)) {
      global[key] = window[key];
    }
  }
}
