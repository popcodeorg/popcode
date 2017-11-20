const elementHighlighterScript = `(${function() {
  window.addEventListener('message', (message) => {
    try {
      const data = JSON.parse(message.data);
      if (data.type === 'org.popcode.highlightElement') {
        const {
          selector: selector,
        } = data;
        updateCovers(selector);
      }

      if (data.type === 'org.popcode.removeHighlight') {
        removeCovers();
      }
    } catch (e) {
    }
  });

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
    removeCovers();
    if (selector !== '') {
      const elements = document.querySelectorAll(selector);
      for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        const offset = getOffsetFromBody(element);
        const cover = document.body.appendChild(document.createElement('div'));
        cover.className = '__popcode-highlighter';
        cover.style.left = `${offset.left}px`;
        cover.style.top = `${offset.top}px`;
        cover.style.width = `${element.offsetWidth}px`;
        cover.style.height = `${element.offsetHeight}px`;
      }
    }
  }
}.toString()}());`;

export default elementHighlighterScript;
