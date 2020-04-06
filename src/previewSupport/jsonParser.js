import superJson from 'super-json';
import isElement from 'lodash-es/isElement';

const DOMSerializer = {
  serialize: el => [el.outerHTML],
  deserialize: el => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(el, 'text/html');
    return doc.body.firstElementChild;
  },
  isInstance: el => isElement(el),
  name: 'DOM',
};

const UndefinedSerializer = {
  serialize: () => ['undefined'],
  deserialize: u => u,
  isInstance: u => typeof u === 'undefined',
  name: 'Undefined',
};

export const superJsonParser = superJson.create({
  magic: '#!',
  serializers: [
    DOMSerializer,
    UndefinedSerializer,
    superJson.dateSerializer,
    superJson.regExpSerializer,
    superJson.functionSerializer,
  ],
});

export default function parseJSON(value) {
  return superJsonParser.stringify(value);
}
