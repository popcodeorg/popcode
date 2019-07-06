import retryingFailedImports from './retryingFailedImports';

const BEAUTIFY_SETTINGS = {
  indent_size: 4,
  indent_char: ' ',
  indent_with_tabs: false,
  eol: '\n',
  end_with_newline: false,
  indent_inner_html: true,
  indent_level: 0,
  preserve_newlines: true,
  max_preserve_newlines: 10,
  space_in_paren: false,
  space_in_empty_paren: false,
  jslint_happy: false,
  space_after_anon_function: false,
  brace_style: 'collapse',
  unindent_chained_methods: false,
  break_chained_methods: false,
  keep_array_indentation: false,
  unescape_strings: false,
  wrap_line_length: 0,
  e4x: false,
  comma_first: false,
  operator_position: 'before-newline',
  /* don't add new lines before head,body,/html https://github.com/beautify-web/js-beautify */
  extra_liners: [],
};

const importingBeautify = importBeautify();

async function importBeautify() {
  return retryingFailedImports(() =>
    import(
      /* webpackChunkName: "mainAsync" */
      'js-beautify'
    ),
  );
}

export default async function beautifySource(code, mode) {
  const Beautify = await importingBeautify;
  return formatCode(Beautify, code, mode);
}

function formatCode(Beautify, code, mode) {
  if (mode === 'html') {
    return Beautify.html(code, BEAUTIFY_SETTINGS);
  } else if (mode === 'javascript') {
    return Beautify.js(code, BEAUTIFY_SETTINGS);
  } else if (mode === 'css') {
    return Beautify.css(code, BEAUTIFY_SETTINGS);
  }
  throw new Error(`could not format code of type ${mode}`);
}
