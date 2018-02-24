import channel from './channel';

function getOffsetFromBody(element) {
  if (element === document.body) {
    return {top: 0, left: 0};
  }
  const {top, left} = getOffsetFromBody(element.offsetParent);
  return {top: top + element.offsetTop, left: left + element.offsetLeft};
}

function removeCovers() {
  const highlighterElements =
  window.document.querySelectorAll('.__popcode-highlighter');
  for (let i = 0; i < highlighterElements.length; i++) {
    const highlighterElement = highlighterElements[i];
    highlighterElement.remove();
  }
}

function addCovers(selector) {
  const elements = document.querySelectorAll(selector);
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    const cover = document.createElement('div');
    document.body.appendChild(cover);
    const rect = element.getBoundingClientRect();
    let offset = {top: rect.top, left: rect.left};
    if (element.offsetParent === null) {
      cover.style.position = 'fixed';
    } else if (element !== document.body ||
      element !== document.documentElement) {
      offset = getOffsetFromBody(element);
    }
    cover.className = '__popcode-highlighter';
    cover.style.left = `${offset.left}px`;
    cover.style.top = `${offset.top}px`;
    cover.style.width = `${element.offsetWidth}px`;
    cover.style.height = `${element.offsetHeight}px`;
  }
}

function updateCovers(selector) {
  removeCovers();
  if (selector !== '') {
    addCovers(selector);
  }
}

export default function handleElementHighlights() {
  channel.bind(
    'highlightElement',
    (_trans, selector) => updateCovers(selector),
  );
}
