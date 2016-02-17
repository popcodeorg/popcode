import i18n from 'i18next-client';
import htmllint from 'htmllint';
import assign from 'lodash/assign';

const humanErrors = {
  E001: error => {
    switch (error.data.attribute.toLowerCase()) {
      case 'align':
        return generateAnnotation('banned-attributes.align');
      case 'background':
        return generateAnnotation('banned-attributes.background');
      case 'bgcolor':
        return generateAnnotation('banned-attributes.bgcolor');
      case 'border':
      case 'frameborder':
        return generateAnnotation(
          'banned-attributes.frameborder',
          {attribute: error.data.attribute}
        );
      case 'marginwidth':
        return generateAnnotation('banned-attributes.marginwidth');
      case 'marginheight':
        return generateAnnotation('banned-attributes.marginheight');
      case 'scrolling':
        return generateAnnotation('banned-attributes.scrolling');
      case 'width':
        return generateAnnotation('banned-attributes.width');
    }
  },

  E002: () => generateAnnotation('lower-case-attribute-name'),

  E005: error => generateAnnotation(
    'attribute-quotes',
    {attribute: error.data.attribute}
  ),

  E006: () => generateAnnotation('attribute-value'),

  E007: () => generateAnnotation('doctype', {}, ['invalid-tag-name']),

  E008: () => generateAnnotation('doctype'),

  E012: error => generateAnnotation('duplicated-id', {id: error.data.id}),

  E014: () => generateAnnotation('img-src'),

  E016: error => {
    switch (error.data.tag.toLowerCase()) {
      case 'b':
        return generateAnnotation('deprecated-tag.b');
      case 'big':
        return generateAnnotation('deprecated-tag.big');
      case 'center':
        return generateAnnotation('deprecated-tag.center');
      case 'font':
        return generateAnnotation('deprecated-tag.font');
      case 'i':
        return generateAnnotation('deprecated-tag.i');
      case 'strike':
        return generateAnnotation('deprecated-tag.strike');
      case 'tt':
        return generateAnnotation('deprecated-tag.tt');
    }
  },

  E017: () => generateAnnotation('lower-case-tag-name'),

  E027: () => generateAnnotation('missing-title'),

  E028: () => generateAnnotation('duplicated-title'),
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
  'tag-name-match': true,
  'tag-name-lowercase': true,
  'title-max-length': 0,
  'title-no-dup': true,
};

function generateAnnotation(reason, properties, suppresses) {
  const message = i18n.t(`errors.html.${reason}`, properties);
  return {
    raw: message,
    text: message,
    reason,
    suppresses,
  };
}

function convertErrorToAnnotation(error) {
  if (humanErrors.hasOwnProperty(error.code)) {
    const annotation = humanErrors[error.code](error);

    return assign(annotation, {
      row: error.line - 1, column: error.column - 1,
      type: 'error',
    });
  }
}

export default source => htmllint(source, htmlLintOptions).then(errors => {
  const annotations = [];
  errors.forEach(error => {
    const annotation = convertErrorToAnnotation(error);
    if (annotation !== undefined) {
      annotations.push(annotation);
    }
  });
  return annotations;
});
