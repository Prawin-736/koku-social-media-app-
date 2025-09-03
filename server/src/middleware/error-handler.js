export default class ErrorHandler extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}
