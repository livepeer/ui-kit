const STREAM_OPEN_ERROR_MESSAGE = 'stream open failed';
const STREAM_OFFLINE_ERROR_MESSAGE = 'stream is offline';
export const ACCESS_CONTROL_ERROR_MESSAGE =
  'shutting down since this session is not allowed to view this stream';

export const isStreamOfflineError = (error: Error): boolean =>
  error.message.toLowerCase().includes(STREAM_OPEN_ERROR_MESSAGE) ||
  error.message.toLowerCase().includes(STREAM_OFFLINE_ERROR_MESSAGE);

export const isAccessControlError = (error: Error): boolean =>
  error.message.toLowerCase().includes(ACCESS_CONTROL_ERROR_MESSAGE);
