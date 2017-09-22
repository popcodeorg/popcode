const elementHighlighterScript = `(${function() {
  window.addEventListener('message', (message) => {
    const data = JSON.parse(message.data);
    const {selector: {selector: selectorFromMessage}} = data;
    const selector = selectorFromMessage;
    updateCovers(selector);
  });

  function updateCovers(selector) {
    const highlighterElements =
    window.document.querySelectorAll('.popcode_HIGHLIGHTER');
    if (highlighterElements.length !== 0) {
      highlighterElements.forEach((highlighterElement) => {
        highlighterElement.remove();
      });
    }

    if (selector !== '') {
      const elements =
      document.querySelectorAll(selector);
      elements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const cover =
        document.documentElement.appendChild(
          document.createElement('div'));
        cover.className = 'popcode_HIGHLIGHTER';
        cover.style.left = `${rect.left - 1}px`;
        cover.style.top = `${rect.top - 1}px`;
        cover.style.width = `${rect.width + 2}px`;
        cover.style.height = `${rect.height + 2}px`;
      });
    }
  }
}.toString()}());`;

export default elementHighlighterScript;
