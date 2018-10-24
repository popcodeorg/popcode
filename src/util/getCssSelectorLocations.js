import postcss from 'postcss';

export default function getCssSelectorLocations(source) {
  try {
    const rootNode = postcss.parse(source);
    const selectors = [];

    rootNode.walkRules((rule) => {
      selectors.push({
        selector: rule.selector,
        loc: rule.source,
      });
    });

    return selectors;
  } catch (e) {
    return null;
  }
}
