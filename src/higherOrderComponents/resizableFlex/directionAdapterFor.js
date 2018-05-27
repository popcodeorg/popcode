const directionAdapters = {
  column: {
    getCurrentSize(element) {
      return element.offsetHeight;
    },

    getDesiredSize(element, {y}) {
      return y - element.offsetTop;
    },
  },

  row: {
    getCurrentSize(element) {
      return element.offsetWidth;
    },

    getDesiredSize(element, {x}) {
      return x - element.offsetLeft;
    },
  },
};

export default function directionAdapterFor({parentNode}) {
  const flexDirection = getComputedStyle(parentNode)['flex-direction'];
  return directionAdapters[flexDirection];
}
