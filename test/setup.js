import jsdom from 'jsdom';
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import chaiThings from 'chai-things';
import 'chai-react';
import {DOMParser} from 'xmlshim';
import wrap from 'lodash/wrap';

chai.use(dirtyChai);
chai.use(chaiThings);

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
