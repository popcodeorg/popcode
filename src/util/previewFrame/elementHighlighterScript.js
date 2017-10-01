const elementHighlighterScript = `(${function() {
  window.addEventListener('message', (message) => {
    const data = JSON.parse(message.data);
    if (data.type === 'org.popcode.highlightElement') {
      const {selector: selector} = data;
      updateCovers(selector);
    }
  });

  function updateCovers(selector) {
    const highlighterElements =
    window.document.querySelectorAll('.__popcode-highlighter');
    for (const highlighterElement of highlighterElements) {
      highlighterElement.remove();
    }

    if (selector !== '') {
      const elements = document.querySelectorAll(selector);
      for (const element of elements) {
        const rect = element.getBoundingClientRect();
        const cover =
        document.documentElement.appendChild(
          document.createElement('div'));
        cover.className = '__popcode-highlighter';
        cover.style.left = `${rect.left}px`;
        cover.style.top = `${rect.top}px`;
        cover.style.width = `${rect.width}px`;
        cover.style.height = `${rect.height}px`;
      }
    }
  }
}.toString()}());`;

export default elementHighlighterScript;
