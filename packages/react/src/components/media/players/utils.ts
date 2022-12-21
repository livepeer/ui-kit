const ACCESS_CONTROL_ERROR_MESSAGE =
  'Shutting down since this session is not allowed to view this stream';

export const isAccessControlError = (error: Error): boolean => {
  return error.message.indexOf(ACCESS_CONTROL_ERROR_MESSAGE) !== -1;
};
