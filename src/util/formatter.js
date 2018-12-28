
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

export function indexToNonWhitespaceIndex(string, index) {
  return string.slice(0, index).replace(/\s/gu, '').length;
}

export function nonWhitespaceIndexToIndex(string, charIndex) {
  let charI = 0;
  for (let i = 0; i < string.length; i++) {
    if (charI === charIndex) {
      return i;
    }
    if (!/\s/u.test(string[i])) {
      charI++;
    }
  }
  return string.length;
}

export function format(Beautify, code, mode, opts = {}) {
  const options = Object.assign({}, BEAUTIFY_SETTINGS, opts);

  let newCode = code;
  if (mode === 'html') {
    newCode = Beautify.html(code, options);
  } else if (mode === 'javascript') {
    newCode = Beautify.js(code, options);
  } else if (mode === 'css') {
    newCode = Beautify.css(code, options);
  } else {
    throw new Error(`could not format code of type ${mode}`);
  }

  return {
    formatted: newCode,
    language: mode,
  };
}

