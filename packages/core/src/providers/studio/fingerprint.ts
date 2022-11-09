export const fingerprint = (file: File & { exif?: any }) => {
  if (isReactNative()) {
    const hashCode = (str: string) => {
      let hash = 0;
      for (let i = 0, len = str.length; i < len; i++) {
        const chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
      }
      return hash;
    };

    const exifHash = file.exif ? hashCode(JSON.stringify(file.exif)) : 'noexif';

    return Promise.resolve(
      [
        'react-native',
        file.name || 'noname',
        file.size || 'nosize',
        exifHash,
      ].join('/'),
    );
  } else {
    return Promise.resolve(
      ['browser', file.name, file.type, file.size, file.lastModified].join('-'),
    );
  }
};

const isReactNative = (): boolean => {
  return (
    typeof navigator !== 'undefined' &&
    typeof navigator.product === 'string' &&
    navigator.product === 'ReactNative'
  );
};
