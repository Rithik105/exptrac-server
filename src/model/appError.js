class AppError extends Error {
  constructor(errorCode, message) {
    super(message);
    this.statusCode = errorCode;
    this.isKnown = true;
  }
}

module.exports = AppError;
