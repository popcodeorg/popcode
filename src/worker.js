var validations = require('./validations');

self.onmessage = function(event) {
  var data = event.data;
  switch (data.method) {
    case 'validate':
      var payload = data.payload;
      var validate = validations[payload[0]];
      validate.apply(null, payload.slice(1)).then(function(errors) {
        self.postMessage({
          messageId: data.messageId,
          payload: errors,
        });
      });
      break;
    default:
      break;
  }
};
