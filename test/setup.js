import jsdom from 'jsdom';
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import 'chai-react';
import {DOMParser} from 'xmlshim';

chai.use(dirtyChai);

if (!('document' in global)) {
  global.document = jsdom.jsdom(
    '<!doctype html5><html><body></body></html>',
    {url: 'https://popcode.org'}
  );
  global.window = document.defaultView;
  window.DOMParser = DOMParser;

  for (const key in window) {
    if (window.hasOwnProperty(key) && !(key in global)) {
      global[key] = window[key];
    }
  }
}
