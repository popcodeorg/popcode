import castArray from 'lodash-es/castArray';
import compact from 'lodash-es/compact';
import flatMap from 'lodash-es/flatMap';
import isEmpty from 'lodash-es/isEmpty';
import map from 'lodash-es/map';
import trim from 'lodash-es/trim';
import uniq from 'lodash-es/uniq';
import config from '../config';
import retryingFailedImports from '../util/retryingFailedImports';

const downloadingScript = downloadScript();

const parser = new DOMParser();

export const sourceDelimiter = '/*__POPCODESTART__*/';

async function downloadScript() {
  if (config.nodeEnv === 'test') {
    return '';
  }

  const responses = await Promise.all(
    map(document.querySelectorAll('.preview-bundle'), el => fetch(el.src)),
  );
  const scripts =
    await Promise.all(responses.map(response => response.text()));
  return scripts.join('\n');
}

function constructDocument(project) {
  const doc = parser.parseFromString(project.sources.html, 'text/html');
  ensureDocumentElement(doc);
  ensureElement(doc, 'head');
  ensureElement(doc, 'body');
  return doc;
}

function ensureElement(doc, elementName) {
  let element = doc[elementName];
  if (!element) {
    element = doc.createElement(elementName);
    doc.documentElement.appendChild(element);
  }
}

function ensureDocumentElement(doc) {
  let {documentElement} = doc;
  if (!documentElement) {
    documentElement = doc.createElement('html');
    doc.appendChild(documentElement);
  }
}

async function attachLibraries(doc, project) {
  const enabledLibrariesWithDependencies =
    await librariesWithDependencies(project.enabledLibraries);

  if (isEmpty(enabledLibrariesWithDependencies)) {
    return;
  }

  const libraries = await importLibraries();

  for (const libraryKey of enabledLibrariesWithDependencies.reverse()) {
    if (!(libraryKey in libraries)) {
      return;
    }

    const library = libraries[libraryKey];
    attachLibrary(doc, library);
  }
}

function attachLibrary(doc, library) {
  const {css, javascript} = library;
  if (css !== undefined) {
    for (const styles of castArray(css)) {
      attachCssLibrary(doc, styles);
    }
  }
  if (javascript !== undefined) {
    for (const script of castArray(javascript)) {
      attachJavascriptLibrary(doc, script);
    }
  }
}

function attachCssLibrary(doc, css) {
  const styleTag = doc.createElement('style');
  styleTag.textContent = String(css);
  doc.head.appendChild(styleTag);
}

function attachJavascriptLibrary(doc, javascript) {
  const scriptTag = doc.createElement('script');
  const javascriptText = String(javascript);
  scriptTag.innerHTML = javascriptText.replace(/<\/script>/g, '<\\/script>');
  // eslint-disable-next-line prefer-destructuring
  const firstScriptTag = doc.scripts[0];
  if (firstScriptTag) {
    firstScriptTag.parentNode.insertBefore(scriptTag, firstScriptTag);
  } else {
    doc.head.appendChild(scriptTag);
  }
}

async function librariesWithDependencies(libraryKeys) {
  if (isEmpty(libraryKeys)) {
    return libraryKeys;
  }

  const libraries = await importLibraries();

  const requestedLibraries =
    libraryKeys.map(libraryKey => libraries[libraryKey]);

  const dependencies = compact(flatMap(requestedLibraries, 'dependsOn'));

  return uniq(
    compact(librariesWithDependencies(dependencies)).concat(libraryKeys),
  );
}

async function importLibraries() {
  return retryingFailedImports(() => import(
    /* webpackChunkName: 'previewLibraries' */
    '../config/libraryAssets',
  ));
}

function addBase(doc) {
  const {head} = doc;
  const baseTag = doc.createElement('base');
  baseTag.target = '_top';
  // eslint-disable-next-line prefer-destructuring
  const firstChild = head.childNodes[0];
  if (firstChild) {
    head.insertBefore(baseTag, firstChild);
  } else {
    head.appendChild(baseTag);
  }
}

function addCss(doc, {sources: {css}}) {
  const styleTag = doc.createElement('style');
  styleTag.innerHTML = css;
  doc.head.appendChild(styleTag);
}

async function addPreviewSupportScript(doc) {
  const downloadedScript = await downloadingScript;
  const scriptTag = doc.createElement('script');
  scriptTag.innerHTML = downloadedScript;
  doc.head.appendChild(scriptTag);
}

async function addJavascript(
  doc,
  {sources: {javascript}},
  {breakLoops = false},
) {
  if (trim(javascript).length === 0) {
    return;
  }

  let source = `\n${sourceDelimiter}\n${javascript}`;
  if (breakLoops) {
    const {'default': loopBreaker} = await retryingFailedImports(
      () => import(
        /* webpackChunkName: 'mainAsync' */
        'loop-breaker',
      ),
    );
    source = loopBreaker(source);
  }
  const scriptTag = doc.createElement('script');
  scriptTag.innerHTML = source;
  doc.body.appendChild(scriptTag);
}

export function generateTextPreview(project) {
  const {title} = constructDocument(project);
  return (title || '').trim();
}

export default async function compileProject(
  project,
  {isInlinePreview} = {},
) {
  const doc = constructDocument(project);

  await attachLibraries(doc, project);
  if (isInlinePreview) {
    addBase(doc);
  }

  addCss(doc, project);
  if (isInlinePreview) {
    await addPreviewSupportScript(doc);
  }
  await addJavascript(doc, project, {breakLoops: isInlinePreview});

  return {
    title: (doc.title || '').trim(),
    source: `<!DOCTYPE html> ${doc.documentElement.outerHTML}`,
  };
}
