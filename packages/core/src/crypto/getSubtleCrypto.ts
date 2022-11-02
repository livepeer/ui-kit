import { isReactNative } from '../media/browser';

export const getSubtleCrypto = async () => {
  if (isReactNative()) {
    throw new Error('React Native does not support SubtleCrypto.');
  }

  if (typeof window !== 'undefined') {
    if (window?.crypto?.subtle) {
      return window.crypto.subtle;
    }

    throw new Error(
      'Browser is not in a secure context (HTTPS), cannot use SubtleCrypto: https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto',
    );
  } else {
    const crypto = await import('node:crypto');

    return crypto.webcrypto.subtle;
  }
};
