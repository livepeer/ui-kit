import { Src } from 'livepeer/media';

/**
 * Checks if the native player can play the mime type.
 */
export const canPlayMediaNatively = (_src: Src): boolean => {
  // TODO fix this to support other mime types
  return true;
};
