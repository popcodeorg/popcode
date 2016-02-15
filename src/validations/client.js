var MicroEvent = require('microevent');

var worker = new Worker('/compiled/worker.js');
var emitter = new MicroEvent();

worker.onmessage = function(event) {
  emitter.trigger(event.data.messageId, event.data.payload);
};

function validate(language, source, enabledLibraries) {
  var messageId = (Date.now() + Math.random()).toString();

  worker.postMessage({
    messageId: messageId,
    method: 'validate',
    payload: [language, source, enabledLibraries],
  });

  return new Promise(function(resolve) {
    emitter.bind(messageId, function(data) {
      resolve(data);
    });
  });
}

module.exports = validate;
