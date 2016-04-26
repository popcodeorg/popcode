import libraries from '../config/libraries';
import castArray from 'lodash/castArray';

const DOMParser = window.DOMParser;
const parser = new DOMParser();

const sourceDelimiter = '/*__POPCODESTART__*/';

const errorHandlerScript = `(${(() => {
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
}).toString()}());`;

class PreviewGenerator {
  constructor(project) {
    this._project = project;
    this.previewDocument = parser.parseFromString(
      project.sources.html,
      'text/html'
    );
    this._previewHead = this._ensureElement('head');
    this.previewBody = this._ensureElement('body');

    this._attachLibraries();

    this._addCss();
    this._addErrorHandling();
    this._addJavascript();
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

  _addCss() {
    const styleTag = this.previewDocument.createElement('style');
    styleTag.innerHTML = this._project.sources.css;
    this._previewHead.appendChild(styleTag);
  }

  _addJavascript() {
    const scriptTag = this.previewDocument.createElement('script');
    scriptTag.innerHTML =
      `\n${sourceDelimiter}\n${this._project.sources.javascript}`;
    this.previewBody.appendChild(scriptTag);

    return this.previewDocument.documentElement.outerHTML;
  }

  _addErrorHandling() {
    const scriptTag = this.previewDocument.createElement('script');
    scriptTag.innerHTML = errorHandlerScript;
    this.previewBody.appendChild(scriptTag);
  }

  _attachLibraries() {
    this._project.enabledLibraries.forEach((libraryKey) => {
      const library = libraries[libraryKey];
      const css = library.css;
      const javascript = library.javascript;
      if (css !== undefined) {
        castArray(css).forEach(this._attachCssLibrary.bind(this));
      }
      if (javascript !== undefined) {
        castArray(javascript).
          forEach(this._attachJavascriptLibrary.bind(this));
      }
    });
  }

  _attachCssLibrary(css) {
    const styleTag = this.previewDocument.createElement('style');
    styleTag.textContent = css;
    this._previewHead.appendChild(styleTag);
  }

  _attachJavascriptLibrary(javascript) {
    const scriptTag = this.previewDocument.createElement('script');
    scriptTag.textContent = javascript;
    this.previewBody.appendChild(scriptTag);
  }
}

function generatePreview(project) {
  return new PreviewGenerator(project).previewDocument;
}

export {sourceDelimiter};
export default generatePreview;
