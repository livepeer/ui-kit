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

export const STREAM_OPEN_ERROR_MESSAGE = 'stream open failed';
export const STREAM_OFFLINE_ERROR_MESSAGE = 'stream is offline';
export const STREAM_WAITING_FOR_DATA_ERROR_MESSAGE =
  'stream is waiting for data';
export const ACCESS_CONTROL_ERROR_MESSAGE =
  'shutting down since this session is not allowed to view this stream';

export const isStreamOfflineError = (error: Error): boolean =>
  error.message.toLowerCase().includes(STREAM_OPEN_ERROR_MESSAGE) ||
  error.message.toLowerCase().includes(STREAM_WAITING_FOR_DATA_ERROR_MESSAGE) ||
  error.message.toLowerCase().includes(STREAM_OFFLINE_ERROR_MESSAGE);

export const isAccessControlError = (error: Error): boolean =>
  error.message.toLowerCase().includes(ACCESS_CONTROL_ERROR_MESSAGE);
