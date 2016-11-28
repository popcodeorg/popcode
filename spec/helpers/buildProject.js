import merge from 'lodash/merge';
let keyOffset = 0;

export default function buildProject(project = {}) {
  return merge(
    {
      projectKey: (Date.now() * 1000 + (keyOffset += 1)).toString(),
      sources: {
        html: '<!doctype html><html></html>',
        css: '',
        javascript: '',
      },
      enabledLibraries: [],
    },
    project
  );
}
