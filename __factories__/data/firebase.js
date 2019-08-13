import {Factory} from 'rosie';

export const firebaseRepositoryFactory = new Factory().attrs({
  hiddenUIComponents: ['console'],
  instructions: '',
  isArchived: false,
  projectKey: () => {
    const date = new Date();
    return (date.getTime() * 1000 + date.getMilliseconds()).toString();
  },
  sources: {
    css: '',
    html:
      '<!DOCTYPE html>' +
      '<html><head><title>Sample Project</title></head><body></body></html>',
    javascript: '',
  },
  updatedAt: Date.now(),
});
