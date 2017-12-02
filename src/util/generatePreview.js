import castArray from 'lodash/castArray';
import compact from 'lodash/compact';
import flatMap from 'lodash/flatMap';
import isEmpty from 'lodash/isEmpty';
import pick from 'lodash/pick';
import uniq from 'lodash/uniq';
import loopBreaker from 'loop-breaker';
import libraries from '../config/libraries';
import previewFrameLibraries from '../config/previewFrameLibraries';

const parser = new DOMParser();

export const sourceDelimiter = '/*__POPCODESTART__*/';

const errorHandlerScript = `(${function() {
  const windowParent = window.parent;
  const windowName = window.name;

  window.onerror = (fullMessage, _file, line, column, error) => {
    let name, message;
    if (error) {
      ({name, message} = error);
    } else {
      const components = fullMessage.split(': ', 2);
      if (components.length === 2) {
        [name, message] = components;
      } else {
        name = 'Error';
        message = fullMessage;
      }
    }

    windowParent.postMessage(JSON.stringify({
      type: 'org.popcode.error',
      windowName,
      payload: {
        name,
        message,
        line,
        column,
      },
    }), '*');
  };
}.toString()}());`;

const messageHandlerScript = `(${function() {
  // eslint-disable-next-line no-eval
  const globalEval = window.eval;
  const windowName = window.name;
  const windowParent = window.parent;

  window.addEventListener('message', ({data: message}) => {
    let type, expression, key;
    try {
      ({type, payload: {key, expression}} = JSON.parse(message));
    } catch (_e) {
      return;
    }

    if (type !== 'org.popcode.console.expression') {
      return;
    }

    try {
      const value = globalEval(expression);
      windowParent.postMessage(JSON.stringify({
        type: 'org.popcode.console.value',
        windowName,
        payload: {key, value},
      }), '*');
    } catch (error) {
      windowParent.postMessage(JSON.stringify({
        type: 'org.popcode.console.error',
        windowName,
        payload: {key, error: {name: error.name, message: error.message}},
      }), '*');
    }
  });
}.toString()}());`;

const alertAndPromptReplacementScript = `(${function() {
  const _swal = window.swal;

  Object.defineProperties(window, { // eslint-disable-line prefer-reflect
    alert: {
      value: (message) => {
        _swal(String(message));
      },
      configurable: true,
    },
    prompt: {
      value: (message, defaultValue = '') => defaultValue,
      configurable: true,
    },
  });

  delete window.swal; // eslint-disable-line prefer-reflect
}.toString()}());`;

export class PreviewGenerator {
  constructor(project, options = {}) {
    this._project = project;
    this._previewDocument = parser.parseFromString(
      project.sources.html,
      'text/html',
    );
    this._previewHead = this._ensureElement('head');
    this.previewBody = this._ensureElement('body');
    this._firstScriptTag = this._previewDocument.querySelector('script');

    this._attachLibraries(
      pick(options, ['nonBlockingAlertsAndPrompts']),
    );

    if (options.targetBaseTop) {
      this._addBase();
    }
    this._addCss();
    if (options.propagateErrorsToParent) {
      this._addErrorHandling();
    }
    if (options.listenForMessages) {
      this._addMessageHandling();
    }

    if (options.nonBlockingAlertsAndPrompts) {
      this._addAlertAndPromptHandling();
    }

    this._addJavascript(pick(options, 'breakLoops'));
  }

  get title() {
    return (this._previewDocument.title || '').trim();
  }

  get source() {
    const {_previewDocument: {documentElement}} = this;
    return `<!DOCTYPE html> ${documentElement.outerHTML}`;
  }

  _ensureDocumentElement() {
    let {documentElement} = this._previewDocument;
    if (!documentElement) {
      documentElement = this._previewDocument.createElement('html');
      this._previewDocument.appendChild(documentElement);
    }
    return documentElement;
  }

  _ensureElement(elementName) {
    let element = this._previewDocument[elementName];
    if (!element) {
      element = this._previewDocument.createElement(elementName);
      this._ensureDocumentElement().appendChild(element);
    }
    return element;
  }

  _addBase() {
    const baseTag = this._previewDocument.createElement('base');
    baseTag.target = '_top';
    const [firstChild] = this._previewHead.childNodes;
    if (firstChild) {
      this._previewHead.insertBefore(baseTag, firstChild);
    } else {
      this._previewHead.appendChild(baseTag);
    }
  }

  _addCss() {
    const styleTag = this._previewDocument.createElement('style');
    styleTag.innerHTML = this._project.sources.css;
    this._previewHead.appendChild(styleTag);
  }

  _addJavascript({breakLoops = false}) {
    let source = `\n${sourceDelimiter}\n${this._project.sources.javascript}`;
    if (breakLoops) {
      source = loopBreaker(source);
    }
    const scriptTag = this._previewDocument.createElement('script');
    scriptTag.innerHTML = source;
    this.previewBody.appendChild(scriptTag);
    return this._previewDocument.documentElement.outerHTML;
  }

  _addErrorHandling() {
    const scriptTag = this._previewDocument.createElement('script');
    scriptTag.innerHTML = errorHandlerScript;
    this.previewBody.appendChild(scriptTag);
  }

  _addMessageHandling() {
    const scriptTag = this._previewDocument.createElement('script');
    scriptTag.innerHTML = messageHandlerScript;
    this.previewBody.appendChild(scriptTag);
  }

  _addAlertAndPromptHandling() {
    const scriptTag = this._previewDocument.createElement('script');
    scriptTag.innerHTML = alertAndPromptReplacementScript;
    this.previewBody.appendChild(scriptTag);
  }

  _attachLibraries({nonBlockingAlertsAndPrompts = false}) {
    const enabledLibrariesWithDependencies =
      this._librariesWithDependencies(this._project.enabledLibraries);

    for (const libraryKey of enabledLibrariesWithDependencies) {
      if (!(libraryKey in libraries)) {
        return;
      }

      const library = libraries[libraryKey];
      this._attachLibrary(library);
    }

    if (nonBlockingAlertsAndPrompts) {
      this._attachLibrary(previewFrameLibraries.sweetalert);
    }
  }

  _librariesWithDependencies(libraryKeys) {
    if (isEmpty(libraryKeys)) {
      return libraryKeys;
    }

    const requestedLibraries =
      libraryKeys.map(libraryKey => libraries[libraryKey]);

    const dependencies = compact(flatMap(requestedLibraries, 'dependsOn'));

    return uniq(
      compact(this._librariesWithDependencies(dependencies)).
        concat(libraryKeys),
    );
  }

  _attachLibrary(library) {
    const {css, javascript} = library;
    if (css !== undefined) {
      castArray(css).forEach(this._attachCssLibrary.bind(this));
    }
    if (javascript !== undefined) {
      castArray(javascript).
        forEach(this._attachJavascriptLibrary.bind(this));
    }
  }

  _attachCssLibrary(css) {
    const styleTag = this._previewDocument.createElement('style');
    styleTag.textContent = String(css);
    this._previewHead.appendChild(styleTag);
  }

  _attachJavascriptLibrary(javascript) {
    const scriptTag = this._previewDocument.createElement('script');
    const javascriptText = String(javascript);
    scriptTag.innerHTML = javascriptText.replace(/<\/script>/g, '<\\/script>');
    if (this._firstScriptTag) {
      this._firstScriptTag.parentNode.
        insertBefore(scriptTag, this._firstScriptTag);
    } else {
      this._previewHead.appendChild(scriptTag);
    }
  }
}

export function generateTextPreview(project) {
  const {title} = parser.parseFromString(project.sources.html, 'text/html');
  return (title || '').trim();
}

export default function generatePreview(project, options) {
  const {source, title} = new PreviewGenerator(project, options);
  return {source, title};
}
