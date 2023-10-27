export class MediaTypeError extends Error {
    constructor(msg: string) {
      super(msg);
      this.name = 'MediaTypeError';
    }
  }