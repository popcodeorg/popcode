class Analyzer {
  constructor(project) {
    this._project = project;
  }

  containsExternalScript() {
    const docElement = this._project.get('sources').get('html');
    const doc = new DOMParser().parseFromString(docElement, 'text/html');
    return doc.documentElement.innerHTML.includes('</script>');
  }

}

export default Analyzer;
