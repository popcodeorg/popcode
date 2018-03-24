import {Record, Set, Map} from 'immutable';

import HTML_TEMPLATE from '../../templates/new.html';
import {hiddenUIArrayToObject} from '../util/migrations';
import HiddenUIComponent from './HiddenUIComponent';

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
