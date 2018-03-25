import {Record, Set, Map} from 'immutable';
import isArray from 'lodash/isArray';
import isPlainObject from 'lodash/isPlainObject';

import HTML_TEMPLATE from '../../templates/new.html';
import HiddenUIComponent from './HiddenUIComponent';

function hiddenUIArrayToObject(hiddenUIComponents) {
  let obj = {};
  if (isPlainObject(hiddenUIComponents)) {
    obj = hiddenUIComponents;
  } else if (isArray(hiddenUIComponents)) {
    let component;
    for (component of hiddenUIComponents) {
      const [componentType, language] = component.split('.');
      const componentKey = language || componentType;
      obj[componentKey] = new HiddenUIComponent({componentType, language});
    }
  }
  obj.console = new HiddenUIComponent({componentType: 'console'});
  return obj;
}

const Sources = Record({
  html: HTML_TEMPLATE,
  css: '',
  javascript: '',
});

export default class Project extends Record({
  projectKey: null,
  sources: new Sources(),
  enabledLibraries: new Set(),
  hiddenUIComponents: new Map({
    console: new HiddenUIComponent({componentType: 'console'}),
  }),
  updatedAt: null,
  instructions: '',
}) {
  static fromJS({
    projectKey = null,
    sources = {},
    enabledLibraries = [],
    hiddenUIComponents = {},
    updatedAt = null,
    instructions = '',
  }) {
    return new Project({
      projectKey,
      sources: new Sources(sources),
      enabledLibraries: new Set(enabledLibraries),
      hiddenUIComponents: new Map(hiddenUIArrayToObject(hiddenUIComponents)),
      updatedAt,
      instructions,
    });
  }
}
