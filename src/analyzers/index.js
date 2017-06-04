import isUndefined from 'lodash/isUndefined';

const domParser = new DOMParser();

class Analyzer {
  constructor(project) {
    this._project = project;
  }

  get doc() {
    if (isUndefined(this._doc)) {
      const htmlString = this._project.getIn(['sources', 'html']);
      this._doc = domParser.parseFromString(htmlString, 'text/html');
    }
    return this._doc;
  }

  get containsExternalScript() {
    return Boolean(this.doc.querySelector('script'));
  }

  get enabledLibraries() {
    return this._project.get('enabledLibraries').toJS();
  }
}

export default Analyzer;
