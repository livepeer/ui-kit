/**
 * Error subclass for http errors.
 */
export class HttpError<T = undefined> extends Error {
  readonly code: number;
  readonly data?: T;
  readonly internal?: unknown;

  constructor(
    /** Number error code */
    code: number,
    /** Human-readable string */
    message: string,
    /** Low-level error */
    internal?: unknown,
    /** Other useful information about error */
    data?: T,
  ) {
    if (!Number.isInteger(code)) throw new Error('"code" must be an integer.');
    if (!message || typeof message !== 'string')
      throw new Error('"message" must be a nonempty string.');

    super(message);
    this.code = code;
    this.data = data;
    this.internal = internal;
  }
}
