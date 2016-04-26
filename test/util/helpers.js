import $ from 'jquery';
import {DOMParser} from 'xmlshim';
import mockFirebase from './mockFirebase';

const parser = new DOMParser();

function updateSource($application, language, source) {
  const $editor = $application.find(`Editor[language="${language}"]`);
  $editor[0]._editor.setValue(source);
}

function updateHTMLBody($application, source) {
  const fullSource =
    `<!doctype html>\n<html>\n<head><title>Test</title></head>
    <body>${source}</body>\n</html>\n`;
  updateSource($application, 'html', fullSource);
}

function parsedPreview($application) {
  const $iframe = $($application.nodes()).find('.preview-frame');
  return parser.parseFromString(
    $iframe.prop('srcdoc'),
    'text/html'
  );
}

function logIn() {
  const uid = '12345';
  mockFirebase.changeAuthState({
    uid,
    provider: 'github',
    auth: {uid},
  });
}

function logOut() {
  mockFirebase.changeAuthState(null);
}

export {
  updateSource,
  updateHTMLBody,
  parsedPreview,
  logIn,
  logOut,
};
