import assign from 'lodash/assign';
import {libraries} from '../config';

const DOMParser = window.DOMParser;
const parser = new DOMParser();


const sourceDelimiter = '/*__POPCODESTART__*/';

function generatePreview(project) {
  return new PreviewGenerator(project).previewDocument;
}

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
    this._previewHead = this.previewDocument.head;
    this.previewBody = this.previewDocument.body;

    this._attachLibraries();

    this._addCss();
    this._addErrorHandling();
    this._addJavascript();
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
        this._attachCssLibrary(css);
      }
      if (javascript !== undefined) {
        this._attachJavascriptLibrary(javascript);
      }
    });
  }

  _attachCssLibrary(css) {
    const linkTag = this.previewDocument.createElement('link');
    linkTag.rel = 'stylesheet';
    linkTag.href = css;
    this._previewHead.appendChild(linkTag);
  }

  _attachJavascriptLibrary(javascript) {
    const scriptTag = this.previewDocument.createElement('script');
    scriptTag.src = javascript;
    this.previewBody.appendChild(scriptTag);
  }
}

export {sourceDelimiter};
export default generatePreview;
