export default function ExtendableError(message) {
  this.name = this.constructor.name;
  this.message = message;
  this.stack = new Error(message).stack;
}

ExtendableError.prototype = Object.create(Error.prototype);
ExtendableError.prototype.constructor = ExtendableError;
