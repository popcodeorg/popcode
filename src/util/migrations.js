import isArray from 'lodash/isArray';
import isPlainObject from 'lodash/isPlainObject';

export function hiddenUIArrayToObject(hiddenUIComponents) {
  let obj = {};
  if (isPlainObject(hiddenUIComponents)) {
    obj = hiddenUIComponents;
  } else if (isArray(hiddenUIComponents)) {
    let componentName;
    for (componentName of hiddenUIComponents) {
      obj[componentName] = {componentName};
    }
  }
  return obj;
}

export function migrateProjectJS(js) {
  js.hiddenUIComponents = hiddenUIArrayToObject(js.hiddenUIComponents);
  js.hiddenUIComponents.console = {componentName: 'console'};
  return js;
}
