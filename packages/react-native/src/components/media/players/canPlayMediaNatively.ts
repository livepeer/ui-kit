import { Src } from '@livepeer/core-react';

/**
 * Checks if the native player can play the mime type.
 */
export const canPlayMediaNatively = (src: Src): boolean => {
  // TODO fix this to filter based on android/ios support
  return src.type !== 'webrtc';
};
