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

function updateCovers(selector) {
  console.log(selector);
  removeCovers();
  if (selector !== '') {
    const elements = document.querySelectorAll(selector);
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      const offset = getOffsetFromBody(element);
      const cover = document.createElement('div');
      console.log(cover);
      console.log(document.body);
      document.body.appendChild(cover);
      console.log(document.body);
      cover.className = '__popcode-highlighter';
      cover.style.left = `${offset.left}px`;
      cover.style.top = `${offset.top}px`;
      cover.style.width = `${element.offsetWidth}px`;
      cover.style.height = `${element.offsetHeight}px`;
    }
  }
}

export default function handleElementHighlights() {
  channel.bind(
    'highlightElement',
    (_trans, selector) => updateCovers(selector),
  );

  channel.bind(
    'removeHighlight',
    () => removeCovers(),
  );
}
