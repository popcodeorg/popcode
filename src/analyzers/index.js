import isNull from 'lodash/isNull';

const DEFAULT_CONDITIONS = {
  containsExternalScript: {
    actionName: 'OVERRIDE_JSHINT_W117',
    payload: {
      enabled: true,
    },
  },
};

class CustomHtmlAnalyzer {
  constructor(source) {
    this._source = source;
    this._doc = new DOMParser().parseFromString(this._source, 'text/html');
  }

  getConditions() {
    return Promise.resolve(this._checkConditions());
  }

  _checkConditions() {
    if (isNull(this._doc.documentElement)) {
      return Promise.resolve(DEFAULT_CONDITIONS);
    }

    const containsExternalScript = this._checkForExternalScript();

    return Promise.resolve({
      containsExternalScript,
    });
  }

  _checkForExternalScript() {
    return {
      actionName: DEFAULT_CONDITIONS.containsExternalScript.actionName,
      payload: {
        enabled: !this._doc.documentElement.innerHTML.includes('</script>'),
      },
    };
  }

}

export default {
  html: (source) => new CustomHtmlAnalyzer(source).getConditions(),
};
