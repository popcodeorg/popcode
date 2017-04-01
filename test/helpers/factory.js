import isNil from 'lodash/isNil';
import isEmpty from 'lodash/isEmpty';

export function gistData({html, css, javascript, enabledLibraries = []} = {}) {
  const files = [];
  if (!isNil(html)) {
    files.push({language: 'HTML', filename: 'index.html', content: html});
  }
  if (!isNil(css)) {
    files.push({language: 'CSS', filename: 'styles.css', content: css});
  }
  if (!isNil(javascript)) {
    files.push({
      language: 'JavaScript',
      filename: 'script.js',
      content: javascript,
    });
  }
  if (!isEmpty(enabledLibraries)) {
    files.push({
      language: 'JSON',
      filename: 'popcode.json',
      content: JSON.stringify({enabledLibraries}),
    });
  }
  return {files};
}
