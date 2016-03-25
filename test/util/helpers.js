import $ from 'jquery';
import {DOMParser} from 'xmlshim';

const parser = new DOMParser();

function updateSource($application, language, source) {
  const $editor = $application.find(`Editor[language="${language}"]`);
  $editor[0]._editor.setValue(source);
}

function updateHTMLBody($application, source) {
  const fullSource =
    `<!doctype html>\n<html>\n<head></head><body>${source}</body>\n</html>\n`;
  updateSource($application, 'html', fullSource);
}

function parsedPreview($application) {
  const $iframe = $($application.nodes()).find('.preview-frame');
  return parser.parseFromString(
    $iframe.prop('srcdoc'),
    'text/html'
  );
}

export {
  updateSource,
  updateHTMLBody,
  parsedPreview,
};
