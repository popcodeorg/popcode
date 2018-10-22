import throttle from 'lodash-es/throttle';

import channel from './channel';

const RESIZE_THROTTLE = 250;
let highlightSelector = null;

const handleWindowResize = throttle(() => {
  updateCovers(highlightSelector);
}, RESIZE_THROTTLE);

window.addEventListener('resize', handleWindowResize);

function getOffsetFromBody(element) {
  if (element === document.body) {
    return {top: 0, left: 0};
  }
  const {top, left} = getOffsetFromBody(element.offsetParent);
  return {top: top + element.offsetTop, left: left + element.offsetLeft};
}

function removeCovers() {
  const highlighterElements =
    document.querySelectorAll('.__popcode-highlighter');
  for (const highlighterElement of highlighterElements) {
    highlighterElement.remove();
  }
}

function addCovers(selector) {
  const elements = document.querySelectorAll(selector);
  for (const element of elements) {
    const cover = document.createElement('div');
    const rect = element.getBoundingClientRect();
    let offset = {top: rect.top, left: rect.left};
    if (element.offsetParent === null) {
      cover.style.position = 'fixed';
    } else if (element !== document.body ||
      element !== document.documentElement) {
      offset = getOffsetFromBody(element);
    }
    document.body.appendChild(cover);
    cover.classList = '__popcode-highlighter';
    cover.style.left = `${offset.left}px`;
    cover.style.top = `${offset.top}px`;
    cover.style.width = `${element.offsetWidth}px`;
    cover.style.height = `${element.offsetHeight}px`;
    cover.classList.add('fade');
  }
}

function updateCovers(selector) {
  removeCovers();
  if (selector !== null) {
    highlightSelector = selector;
    addCovers(selector);
  }
}

export default function handleElementHighlights() {
  channel.bind(
    'highlightElement',
    (_trans, selector) => updateCovers(selector),
  );
}
