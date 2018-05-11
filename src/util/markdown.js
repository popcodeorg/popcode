import memoize from 'lodash-es/memoize';
import remark from 'remark';
import remarkReact from 'remark-react';
import externalLinks from 'remark-external-links';
import remarkLowlight from 'remark-react-lowlight';
import css from 'highlight.js/lib/languages/css';
import xml from 'highlight.js/lib/languages/xml';
import js from 'highlight.js/lib/languages/javascript';
import githubSchema from 'hast-util-sanitize/lib/github.json';

const remarkWithHighlighting = memoize(() => {
  const schema = Object.assign({}, githubSchema, {
    attributes: Object.assign({}, githubSchema.attributes, {
      code: [
        ...(githubSchema.attributes.code || []),
        'className',
      ],
    }),
  });

  return remark().
    use(externalLinks).
    use(remarkReact, {
      sanitize: schema,
      remarkReactComponents: {
        code: remarkLowlight({css, js, xml}),
      },
    });
});

export function toReact(markdown) {
  return remarkWithHighlighting().processSync(markdown).contents;
}
