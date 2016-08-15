import htmllint from 'htmllint';
import Validator from '../Validator';

const errorMap = {
  E001: (error) => {
    switch (error.data.attribute.toLowerCase()) {
      case 'align':
        return {reason: 'banned-attributes.align'};
      case 'background':
        return {reason: 'banned-attributes.background'};
      case 'bgcolor':
        return {reason: 'banned-attributes.bgcolor'};
      case 'border':
      case 'frameborder':
        return {
          reason: 'banned-attributes.frameborder',
          payload: {attribute: error.data.attribute},
        };
      case 'marginwidth':
        return {reason: 'banned-attributes.marginwidth'};
      case 'marginheight':
        return {reason: 'banned-attributes.marginheight'};
      case 'scrolling':
        return {reason: 'banned-attributes.scrolling'};
      case 'width':
        return {reason: 'banned-attributes.width'};
    }

    return null;
  },

  E002: () => ({reason: 'lower-case-attribute-name'}),

  E005: (error) => ({
    reason: 'attribute-quotes',
    payload: {attribute: error.data.attribute},
  }),

  E006: () => ({reason: 'attribute-value'}),

  E007: () => ({reason: 'doctype', suppresses: ['invalid-tag-name']}),

  E008: () => ({reason: 'doctype'}),

  E012: (error) => ({reason: 'duplicated-id', payload: {id: error.data.id}}),

  E014: () => ({reason: 'img-src'}),

  E016: (error) => ({
    reason: `deprecated-tag.${error.data.tag.toLowerCase()}`,
  }),

  E017: () => ({reason: 'lower-case-tag-name'}),

  E027: () => ({reason: 'missing-title'}),

  E028: () => ({reason: 'duplicated-title'}),

  E042: (error, source) => {
    const lines = source.split('\n');
    const tagNameExpr = /[^\s>]+/;
    const tag = tagNameExpr.exec(lines[error.line - 1].slice(error.column))[0];

    return {
      reason: 'unclosed-tag',
      payload: {tag},
      suppresses: ['mismatched-close-tag'],
    };
  },
};

const htmlLintOptions = {
  'attr-bans': [
    'align',
    'background',
    'bgcolor',
    'border',
    'frameborder',
    'marginwidth',
    'marginheight',
    'scrolling',
    'width',
  ],
  'attr-name-style': 'lowercase',
  'attr-no-dup': true,
  'attr-quote-style': 'quoted',
  'doctype-first': true,
  'doctype-html5': true,
  'head-req-title': true,
  'id-class-style': false,
  'id-no-dup': true,
  'img-req-alt': false,
  'img-req-src': true,
  'indent-style': 'spaces',
  'indent-width': 4,
  'line-end-style': false,
  'tag-bans': [
    'b',
    'big',
    'center',
    'font',
    'i',
    'tt',
    'strike',
  ],
  'tag-close': true,
  'tag-name-match': true,
  'tag-name-lowercase': true,
  'title-max-length': 0,
  'title-no-dup': true,
};

class HtmllintValidator extends Validator {
  constructor(source) {
    super(source, 'html', errorMap);
  }

  _getRawErrors() {
    return htmllint(this._source, htmlLintOptions).catch(() => []);
  }

  _keyForError(error) {
    return error.code;
  }

  _locationForError(error) {
    const row = error.line - 1;
    const column = error.column - 1;
    return {row, column};
  }
}

export default (source) => new HtmllintValidator(source).getAnnotations();
