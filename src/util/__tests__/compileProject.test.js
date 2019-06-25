import compileProject, {
  addJavascript,
} from '../compileProject';

jest.mock('../../services/babel-browser.gen');

describe('compileProject', () => {
  it('fills out a default template', async() => {
    const result = await compileProject({
      sources: {
        html: '     ',
        css: '     ',
        javascript: '    ',
      },
    });

    expect(result).toEqual({
      title: '',
      source: '<!DOCTYPE html> <html><head><style>     ' +
        '</style></head><body></body></html>',
    });
  });
});

describe('addJavascript', () => {
  it('always calls the generated babel transpiler', async() => {
    const doc = new DOMParser().parseFromString('', 'text/html');
    await addJavascript(doc, {
      sources: {
        javascript: 'const { a, b, ...c } = {' +
        '  a: "he", b: "llo", c: false, d: true' +
        '};',
      },
    });

    // This is testing that the generated code was correctly called
    expect(doc.body.innerHTML).toContain('// Generated code');
  });
});
