import githubSchema from 'hast-util-sanitize/lib/github.json';
import {decode} from 'he';
import css from 'highlight.js/lib/languages/css';
import js from 'highlight.js/lib/languages/javascript';
import xml from 'highlight.js/lib/languages/xml';
import memoize from 'lodash-es/memoize';
import {createElement} from 'react';
import highlight from 'rehype-highlight';
import rehype2react from 'rehype-react';
import sanitize from 'rehype-sanitize';
import externalLinks from 'remark-external-links';
import markdown from 'remark-parse';
import remark2rehype from 'remark-rehype';
import stringify from 'remark-stringify';
import stripMarkdown from 'strip-markdown';
import unified from 'unified';

const remarkWithHighlighting = memoize(() => {
  const schema = Object.assign({}, githubSchema, {
    attributes: Object.assign({}, githubSchema.attributes, {
      code: [...(githubSchema.attributes.code || []), 'className'],
    }),
  });

  return unified()
    .use(markdown)
    .use(externalLinks)
    .use(remark2rehype)
    .use(sanitize, schema)
    .use(highlight, {subset: ['css', 'js', 'xml'], languages: {css, js, xml}})
    .use(rehype2react, {createElement});
});

const remarkToPlainText = memoize(() =>
  unified().use(markdown).use(stripMarkdown).use(stringify),
);

export function toPlainText(markdownSource) {
  return decode(remarkToPlainText().processSync(markdownSource).contents);
}

export function toReact(markdownSource) {
  return remarkWithHighlighting().processSync(markdownSource).result;
}
