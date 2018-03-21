import isArray from 'lodash/isArray';
import isPlainObject from 'lodash/isPlainObject';

/*
export function migrateToMap(collection, transformer) {
  if (Map.isMap(collection)) {
    return collection;
  } else if (!isCollection(collection)) {
    return new Map();
  } else if (!isFunction(transformer)) {
    return collection.toMap();
  }

  const map = {};
  for (const key of collection.keys()) {
    map[key] = transformer(key);
  }
  return fromJS(map);
}

export function migrateHidden(componentName) {
  const languageMatch = componentName.match(/editor\.(\w+)/);
  const language = languageMatch && languageMatch[1];
  return new HiddenUIComponent({componentName, language});
}

export function createHiddenComponent(componentName) {
  return new HiddenUIComponent({componentName});
}

export function migrateHiddenUIComponents(hiddenUIComponents) {
  return migrateToMap(
    hiddenUIComponents,
    createHiddenComponent,
  ).set('console', createHiddenComponent('console'));
}
*/

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
