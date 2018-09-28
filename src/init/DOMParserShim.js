const proto = DOMParser.prototype;
const nativeParse = proto.parseFromString;

function isParsingNativelySupported() {
  try {
    return Boolean(new DOMParser().parseFromString('', 'text/html'));
  } catch (e) {
    return false;
  }
}

if (!isParsingNativelySupported()) {
  proto.parseFromString = function parseFromString(markup, type, ...rest) {
    if (/^\s*text\/html\s*(?:;|$)/iu.test(type)) {
      const doc = document.implementation.createHTMLDocument('');
      if (markup.toLowerCase().indexOf('<!doctype') > -1) {
        doc.documentElement.innerHTML = markup;
      } else {
        doc.body.innerHTML = markup;
      }
      return doc;
    }
    return Reflect.apply(nativeParse, this, [markup, type, ...rest]);
  };
}

export {};
