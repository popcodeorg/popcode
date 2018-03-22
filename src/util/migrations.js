import isArray from 'lodash/isArray';
import isPlainObject from 'lodash/isPlainObject';

export function hiddenUIArrayToObject(hiddenUIComponents) {
  let obj = {};
  if (isPlainObject(hiddenUIComponents)) {
    obj = hiddenUIComponents;
  } else if (isArray(hiddenUIComponents)) {
    let component;
    for (component of hiddenUIComponents) {
      const [componentType, language] = component.split('.');
      const componentName = language || componentType;
      obj[componentName] = {componentType, language};
    }
  }
  return obj;
}

export function migrateProjectJS(js) {
  js.hiddenUIComponents = hiddenUIArrayToObject(js.hiddenUIComponents);
  js.hiddenUIComponents.console = {componentName: 'console'};
  return js;
}
