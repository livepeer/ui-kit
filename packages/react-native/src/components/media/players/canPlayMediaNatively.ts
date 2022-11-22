import { Src } from 'livepeer/media';
import { Platform } from 'react-native';

/**
 * Checks if the native player can play the mime type.
 */
export const canPlayMediaNatively = (_src: Src): boolean => {
  // TODO fix this to filter based on android/ios support
  if (Platform?.OS === 'android') {
    return true;
  } else if (Platform?.OS === 'ios') {
    return true;
  }
  return true;
};
