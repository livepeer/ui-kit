export class IncorrectChainIdError extends Error {
  name = 'IncorrectChainIdError';

  constructor() {
    super('Incorrect chain ID provided');
  }
}
