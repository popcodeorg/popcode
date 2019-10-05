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

export const superJsonParser = superJson.create({
  magic: '#!',
  serializers: [
    superJson.dateSerializer,
    superJson.regExpSerializer,
    superJson.functionSerializer,
    DOMSerializer,
  ],
});

export default function parseJSON(value) {
  return superJsonParser.stringify(value);
}