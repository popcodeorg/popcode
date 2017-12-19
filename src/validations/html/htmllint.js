import clone from 'lodash/clone';
import defaults from 'lodash/defaults';
import reduce from 'lodash/reduce';
import Validator from '../Validator';
import retryingFailedImports from '../../util/retryingFailedImports';

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

  E005: error => ({
    reason: 'attribute-quotes',
    payload: {attribute: error.data.attribute},
  }),

  E006: () => ({reason: 'attribute-value'}),

  E007: () => ({reason: 'doctype', suppresses: ['invalid-tag-name']}),

  E008: () => ({reason: 'doctype'}),

  E012: error => ({reason: 'duplicated-id', payload: {id: error.data.id}}),

  E014: () => ({reason: 'img-src'}),

  E016: error => ({
    reason: `deprecated-tag.${error.data.tag.toLowerCase()}`,
  }),

  E017: () => ({reason: 'lower-case-tag-name'}),

  E018: (error, source) => {
    const lines = source.split('\n');
    const tagNameExpr = /(.*?)\s*\/>/;
    const [, tag] =
      tagNameExpr.exec(lines[error.line - 1].slice(error.column));

    return {
      reason: 'self-closing-tag',
      payload: {tag},
    };
  },

  E027: () => ({reason: 'missing-title'}),

  E028: () => ({reason: 'duplicated-title'}),

  E041: ({data: {classes}}) => ({
    reason: 'duplicated-class',
    payload: {classes},
  }),

  E042: (error, source) => {
    const lines = source.split('\n');
    const tagNameExpr = /[^\s>]+/;
    const [tag] = tagNameExpr.exec(lines[error.line - 1].slice(error.column));

    return {
      reason: 'unclosed-tag',
      payload: {tag},
    };
  },

  E044: () => ({reason: 'only-head-body-in-html'}),

  E045: () => ({reason: 'only-one-head-and-body'}),

  E046: () => ({reason: 'head-before-body'}),

  E047: () => ({reason: 'invalid-tag-in-head'}),
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
  'attr-name-style': 'dash',
  'attr-no-dup': true,
  'attr-quote-style': 'quoted',
  'attr-req-value': true,
  'class-no-dup': true,
  'doctype-first': true,
  'doctype-html5': true,
  'head-req-title': true,
  'head-valid-content-model': true,
  'html-valid-content-model': true,
  'id-no-dup': true,
  'img-req-src': true,
  'tag-bans': [
    'b',
    'big',
    'center',
    'font',
    'i',
    'tt',
    'strike',
  ],
  'tag-name-match': true,
  'tag-name-lowercase': true,
  'tag-self-close': 'never',
  'title-no-dup': true,
};

class HtmllintValidator extends Validator {
  constructor(source) {
    super(source, 'html', errorMap);
  }

  async _getRawErrors() {
    const {Linter, rules} = await retryingFailedImports(
      () => import(
        /* webpackChunkName: 'linters' */
        'htmllint',
      ),
    );
    const linter = new Linter(rules);
    const options = reduce(
      linter.rules.options,
      (acc, {name}) => defaults(acc, {[name]: false}),
      clone(htmlLintOptions),
    );

    try {
      const results = await linter.lint(this._source, options);
      return results;
    } catch (e) {
      return [];
    }
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

export default source => new HtmllintValidator(source).getAnnotations();
