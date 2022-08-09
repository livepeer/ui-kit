export class UserRejectedRequestError extends Error {
  name = 'UserRejectedRequestError';

  constructor() {
    super('User rejected request');
  }
}
