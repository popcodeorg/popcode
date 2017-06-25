import castArray from 'lodash/castArray';
import pick from 'lodash/pick';
import loopBreaker from 'loop-breaker';
import libraries from '../config/libraries';
import previewFrameLibraries from '../config/previewFrameLibraries';

const parser = new DOMParser();

const sourceDelimiter = '/*__POPCODESTART__*/';

const errorHandlerScript = `(${function() {
  window.onerror = (fullMessage, _file, line, column, error) => {
    let name, message;
    if (error) {
      name = error.name;
      message = error.message;
    } else {
      const components = fullMessage.split(': ', 2);
      if (components.length === 2) {
        name = components[0];
        message = components[1];
      } else {
        name = 'Error';
        message = fullMessage;
      }
    }

    window.parent.postMessage(JSON.stringify({
      type: 'org.popcode.error',
      error: {
        name,
        message,
        line,
        column,
      },
    }), '*');
  };
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

class PreviewGenerator {
  constructor(project, options = {}) {
    this._project = project;
    this.previewDocument = parser.parseFromString(
      project.sources.html,
      'text/html',
    );
    this._previewHead = this._ensureElement('head');
    this.previewBody = this._ensureElement('body');

    this.previewText = (this.previewDocument.title || '').trim();
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

    if (options.nonBlockingAlertsAndPrompts) {
      this._addAlertAndPromptHandling();
    }
    if (options.lastRefreshTimestamp) {
      this._addRefreshTimestamp(options.lastRefreshTimestamp);
    }

    this._addJavascript(pick(options, 'breakLoops'));
  }

  _ensureDocumentElement() {
    let documentElement = this.previewDocument.documentElement;
    if (!documentElement) {
      documentElement = this.previewDocument.createElement('html');
      this.previewDocument.appendChild(documentElement);
    }
    return documentElement;
  }

  _ensureElement(elementName) {
    let element = this.previewDocument[elementName];
    if (!element) {
      element = this.previewDocument.createElement(elementName);
      this._ensureDocumentElement().appendChild(element);
    }
    return element;
  }

  _addBase() {
    const baseTag = this.previewDocument.createElement('base');
    baseTag.target = '_top';
    const firstChild = this._previewHead.childNodes[0];
    if (firstChild) {
      this._previewHead.insertBefore(baseTag, firstChild);
    } else {
      this._previewHead.appendChild(baseTag);
    }
  }

  _addCss() {
    const styleTag = this.previewDocument.createElement('style');
    styleTag.innerHTML = this._project.sources.css;
    this._previewHead.appendChild(styleTag);
  }

  _addRefreshTimestamp(timestamp) {
    const dateString = `Last refresh on: ${String(new Date(timestamp))}`;
    const comment = this.previewDocument.createComment(dateString);
    this.previewBody.append(comment);
  }

  _addJavascript({breakLoops = false}) {
    let source = `\n${sourceDelimiter}\n${this._project.sources.javascript}`;
    if (breakLoops) {
      source = loopBreaker(source);
    }
    const scriptTag = this.previewDocument.createElement('script');
    scriptTag.innerHTML = source;
    this.previewBody.appendChild(scriptTag);
    return this.previewDocument.documentElement.outerHTML;
  }

  _addErrorHandling() {
    const scriptTag = this.previewDocument.createElement('script');
    scriptTag.innerHTML = errorHandlerScript;
    this.previewBody.appendChild(scriptTag);
  }

  _addAlertAndPromptHandling() {
    const scriptTag = this.previewDocument.createElement('script');
    scriptTag.innerHTML = alertAndPromptReplacementScript;
    this.previewBody.appendChild(scriptTag);
  }

  _attachLibraries({nonBlockingAlertsAndPrompts = false}) {
    this._project.enabledLibraries.forEach((libraryKey) => {
      if (!(libraryKey in libraries)) {
        return;
      }

      const library = libraries[libraryKey];
      this._attachLibrary(library);
    });

    if (nonBlockingAlertsAndPrompts) {
      this._attachLibrary(previewFrameLibraries.sweetalert);
    }
  }

  _attachLibrary(library) {
    const css = library.css;
    const javascript = library.javascript;
    if (css !== undefined) {
      castArray(css).forEach(this._attachCssLibrary.bind(this));
    }
    if (javascript !== undefined) {
      castArray(javascript).
        forEach(this._attachJavascriptLibrary.bind(this));
    }
  }

  _attachCssLibrary(css) {
    const linkTag = this.previewDocument.createElement('link');
    linkTag.rel = 'stylesheet';
    linkTag.innerHTML = css;
    this._previewHead.insertBefore(linkTag, this._previewHead.firstChild);
  }

  _attachJavascriptLibrary(javascript) {
    const scriptTag = this.previewDocument.createElement('script');
    const javascriptText = String(javascript);
    scriptTag.innerHTML = javascriptText.replace(/<\/script>/g, '<\\/script>');
    this._previewHead.insertBefore(scriptTag, this._previewHead.firstChild);
  }
}

function generatePreview(project, options) {
  const previewDocument =
    new PreviewGenerator(project, options).previewDocument;
  return `<!DOCTYPE html> ${previewDocument.documentElement.outerHTML}`;
}

function generateTextPreview(project) {
  return new PreviewGenerator(project).previewText;
}

export {sourceDelimiter, generateTextPreview};
export default generatePreview;
