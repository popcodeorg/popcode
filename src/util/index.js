export function openWindowWithContent(content, name = '_blank') {
  const newWindow = open('about:blank', name);
  Reflect.deleteProperty(newWindow, 'opener');
  const {document} = newWindow;
  document.open();
  document.write(content);
  document.close();
  return newWindow;
}
