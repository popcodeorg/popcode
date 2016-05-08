import $ from 'jquery';
import find from 'lodash/find';
import ReactDOM from 'react-dom';
import Editor from '../../src/components/Editor';
import {scryRenderedComponentsWithType} from 'react-addons-test-utils';
import {DOMParser} from 'xmlshim';
import mockFirebase from './mockFirebase';

const parser = new DOMParser();

function updateSource(application, language, source) {
  const editors = scryRenderedComponentsWithType(application, Editor);
  const editor = find(
    editors,
    (anEditor) => anEditor.props.language === language
  );
  editor._editor.setValue(source);
}

function updateHTMLBody(application, source) {
  const fullSource =
    `<!doctype html>\n<html>\n<head><title>Test</title></head><body>
    ${source}
    </body>\n</html>\n`;
  updateSource(application, 'html', fullSource);
}

function parsedPreview(application) {
  const $ui = $(ReactDOM.findDOMNode(application));
  const $iframe = $ui.find('.preview-frame');
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
