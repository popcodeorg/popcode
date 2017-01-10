class Analyzer {
  constructor(project) {
    this._project = project;
  }

  get containsExternalScript() {
    const docElement = this._project.get('sources').get('html');
    const doc = new DOMParser().parseFromString(docElement, 'text/html');
    return doc.documentElement.innerHTML.includes('</script>');
  }

  get enabledLibraries() {
    return this._project.get('enabledLibraries').toJS();
  }

}

export default Analyzer;
