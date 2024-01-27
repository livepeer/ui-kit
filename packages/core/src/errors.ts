export const STREAM_OPEN_ERROR_MESSAGE = "stream open failed";
export const STREAM_OFFLINE_ERROR_MESSAGE = "stream is offline";
export const STREAM_WAITING_FOR_DATA_ERROR_MESSAGE =
  "stream is waiting for data";
export const ACCESS_CONTROL_ERROR_MESSAGE =
  "shutting down since this session is not allowed to view this stream";
export const BFRAMES_ERROR_MESSAGE =
  "metadata indicates that webrtc playback contains bframes";
export const NOT_ACCEPTABLE_ERROR_MESSAGE =
  "response indicates unacceptable playback protocol";

export const isStreamOfflineError = (error: Error): boolean =>
  error.message.toLowerCase().includes(STREAM_OPEN_ERROR_MESSAGE) ||
  error.message.toLowerCase().includes(STREAM_WAITING_FOR_DATA_ERROR_MESSAGE) ||
  error.message.toLowerCase().includes(STREAM_OFFLINE_ERROR_MESSAGE);

export const isAccessControlError = (error: Error): boolean =>
  error.message.toLowerCase().includes(ACCESS_CONTROL_ERROR_MESSAGE);

export const isBframesError = (error: Error): boolean =>
  error.message.toLowerCase().includes(BFRAMES_ERROR_MESSAGE);

export const isNotAcceptableError = (error: Error): boolean =>
  error.message.toLowerCase().includes(NOT_ACCEPTABLE_ERROR_MESSAGE);
