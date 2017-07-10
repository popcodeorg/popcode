import Immutable from 'immutable';

export default function buildImmutableProject(
  sources = {html: '', css: '', javascript: ''},
  enabledLibraries = [],
) {
  return new Immutable.Map({
    sources: new Immutable.Map({
      html: sources.html,
      css: sources.css,
      javascript: sources.javascript,
    }),
    enabledLibraries: new Immutable.Set(enabledLibraries),
  });
}
