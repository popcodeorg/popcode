self.onmessage = function(event) {
  self.postMessage({
    messageId: event.data.messageId,
    payload: 'hello',
  });
};
