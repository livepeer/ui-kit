// if volume change is unsupported, the element will always return 1
// similar to https://github.com/videojs/video.js/pull/7514/files
export const isVolumeChangeSupported = (type: "audio" | "video") => {
  return new Promise<boolean>((resolve) => {
    if (typeof window === "undefined") {
      return false;
    }

    const testElement = document.createElement(type);
    const newVolume = 0.342;

    testElement.volume = newVolume;

    setTimeout(() => {
      const isSupported = testElement.volume !== 1;

      testElement.remove();

      resolve(isSupported);
    });
  });
};
