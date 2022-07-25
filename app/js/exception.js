class InvalidArgumentException extends Error {
    constructor(message) {
      super(message);
      this.name = 'InvalidArgumentException';
    }
}

class InvalidRequestException extends Error {
    constructor(message) {
      super(message);
      this.name = 'InvalidRequestException';
    }
}

export { InvalidArgumentException, InvalidRequestException };