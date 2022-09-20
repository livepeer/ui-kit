const methodsList = [
  // modern browsers
  {
    requestFullscreen: 'requestFullscreen',
    exitFullscreen: 'exitFullscreen',
    fullscreenElement: 'fullscreenElement',
    fullscreenEnabled: 'fullscreenEnabled',
    fullscreenchange: 'fullscreenchange',
    fullscreenerror: 'fullscreenerror',
  },
  // new WebKit
  {
    requestFullscreen: 'webkitRequestFullscreen',
    exitFullscreen: 'webkitExitFullscreen',
    fullscreenElement: 'webkitFullscreenElement',
    fullscreenEnabled: 'webkitFullscreenEnabled',
    fullscreenchange: 'webkitfullscreenchange',
    fullscreenerror: 'webkitfullscreenerror',
  },
  // old WebKit
  {
    requestFullscreen: 'webkitRequestFullScreen',
    exitFullscreen: 'webkitCancelFullScreen',
    fullscreenElement: 'webkitCurrentFullScreenElement',
    fullscreenEnabled: 'webkitCancelFullScreen',
    fullscreenchange: 'webkitfullscreenchange',
    fullscreenerror: 'webkitfullscreenerror',
  },
  // old firefox
  {
    requestFullscreen: 'mozRequestFullScreen',
    exitFullscreen: 'mozCancelFullScreen',
    fullscreenElement: 'mozFullScreenElement',
    fullscreenEnabled: 'mozFullScreenEnabled',
    fullscreenchange: 'mozfullscreenchange',
    fullscreenerror: 'mozfullscreenerror',
  },
  // old IE
  {
    requestFullscreen: 'msRequestFullscreen',
    exitFullscreen: 'msExitFullscreen',
    fullscreenElement: 'msFullscreenElement',
    fullscreenEnabled: 'msFullscreenEnabled',
    fullscreenchange: 'MSFullscreenChange',
    fullscreenerror: 'MSFullscreenError',
  },
] as const;

// iOS API (on the video element itself!)
const iosMethods = {
  requestFullscreen: 'webkitEnterFullscreen',
  exitFullscreen: 'webkitExitFullscreen',
  fullscreenElement: null,
  fullscreenEnabled: 'webkitDisplayingFullscreen',
  fullscreenchange: 'fullscreenchange',
  fullscreenerror: 'fullscreenerror',
} as const;

export const isFullscreenSupported = (element?: HTMLMediaElement | null) => {
  if (typeof document === 'undefined') {
    return false;
  }

  return Boolean(getFullscreenMethods(element));
};

export const isCurrentlyFullscreen = (element?: HTMLMediaElement | null) => {
  const methods = getFullscreenMethods(element);

  if (methods) {
    return Boolean(document[methods.fullscreenElement as 'fullscreenElement']);
  }

  return false;
};

export const enterFullscreen = (element?: HTMLMediaElement | null) => {
  const methods = getFullscreenMethods(element);

  if (methods) {
    return new Promise<void>((resolve, reject) => {
      const fullscreenMethod = methods.requestFullscreen as 'requestFullscreen';

      const onFullScreen = () => {
        removeFullscreenEventListener(onFullScreen);
        resolve();
      };

      addFullscreenEventListener(onFullScreen);

      const returnPromise: Promise<void> | void | null =
        methods.fullscreenElement
          ? element?.parentElement?.[fullscreenMethod]?.()
          : element?.[fullscreenMethod]?.() ?? null;

      if (returnPromise === null) {
        return resolve();
      }

      if (returnPromise instanceof Promise) {
        returnPromise.then(onFullScreen).catch(reject);
      }
    });
  }

  return false;
};

export const exitFullscreen = (element?: HTMLMediaElement | null) => {
  const methods = getFullscreenMethods(element);

  if (methods) {
    return new Promise<void>((resolve, reject) => {
      if (!isCurrentlyFullscreen()) {
        resolve();
        return;
      }

      const onFullScreenExit = () => {
        removeFullscreenEventListener(onFullScreenExit);
        resolve();
      };

      addFullscreenEventListener(onFullScreenExit);

      const returnPromise: Promise<void> | void | null =
        methods.fullscreenElement
          ? document?.[methods.exitFullscreen as 'exitFullscreen']?.()
          : element?.[methods.exitFullscreen as 'requestFullscreen']?.() ??
            null;

      if (returnPromise instanceof Promise) {
        returnPromise.then(onFullScreenExit).catch(reject);
      }
    });
  }

  return false;
};

export const addFullscreenEventListener = (
  callback: EventListenerOrEventListenerObject,
) => {
  const methods = getFullscreenMethods();

  if (methods) {
    document.addEventListener(methods.fullscreenchange, callback, false);

    return () => {
      removeFullscreenEventListener(callback);
    };
  }

  return null;
};

const removeFullscreenEventListener = (
  callback: EventListenerOrEventListenerObject,
) => {
  const methods = getFullscreenMethods();

  if (methods) {
    document.removeEventListener(methods.fullscreenchange, callback, false);

    return true;
  }

  return false;
};

const getFullscreenMethods = (element?: HTMLMediaElement | null) => {
  if (typeof document === 'undefined') {
    return null;
  }

  for (const methods of methodsList) {
    const exitFullscreenMethod = methods.exitFullscreen;

    if (exitFullscreenMethod in document) {
      return methods;
    }
  }

  if (element && iosMethods.requestFullscreen in element) {
    return iosMethods;
  }

  return null;
};
