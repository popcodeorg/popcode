class Analyzer {
  constructor(project) {
    this._project = project;
    this._domParser = new DOMParser();
    const htmlString = this._project.getIn(['sources', 'html']);
    this._doc = this._domParser.parseFromString(htmlString, 'text/html');
  }

  get containsExternalScript() {
    return this._doc.querySelector('script');
  }

  get enabledLibraries() {
    return this._project.get('enabledLibraries').toJS();
  }
}

export default Analyzer;
