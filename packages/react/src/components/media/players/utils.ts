const STREAM_OFFLINE_ERROR_MESSAGE = 'stream open failed';
const ACCESS_CONTROL_ERROR_MESSAGE =
  'shutting down since this session is not allowed to view this stream';

export const isStreamOfflineError = (error: Error): boolean =>
  error.message.toLowerCase().indexOf(STREAM_OFFLINE_ERROR_MESSAGE) !== -1;

export const isAccessControlError = (error: Error): boolean =>
  error.message.toLowerCase().indexOf(ACCESS_CONTROL_ERROR_MESSAGE) !== -1;
