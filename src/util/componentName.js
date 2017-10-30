export function makeComponentName({componentType, componentId}) {
  if (componentId) {
    return `${componentType}.${componentId}`;
  }
  return componentType;
}


