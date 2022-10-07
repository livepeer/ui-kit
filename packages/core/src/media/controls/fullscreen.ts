import { isClient } from '../browser';

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

export const isFullscreenSupported = (
  inputElement?: HTMLMediaElement | null,
) => {
  return Boolean(getFullscreenMethods(inputElement));
};

export const isCurrentlyFullscreen = (
  inputElement?: HTMLMediaElement | null,
) => {
  const { methods } = getFullscreenMethods(inputElement);

  if (methods?.fullscreenElement) {
    return Boolean(document[methods.fullscreenElement]);
  }

  return false;
};

export const enterFullscreen = (inputElement?: HTMLMediaElement | null) => {
  const { methods, element } = getFullscreenMethods(inputElement);

  if (methods) {
    return new Promise<void>((resolve, reject) => {
      const fullscreenMethod = methods.requestFullscreen;

      const onFullScreen = () => {
        removeFullscreenEventListener(onFullScreen);
        resolve();
      };

      addFullscreenEventListener(onFullScreen);

      const returnPromise: Promise<void> | void | null =
        methods.fullscreenElement
          ? element?.parentElement?.[
              fullscreenMethod as 'requestFullscreen'
            ]?.()
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

export const exitFullscreen = (inputElement?: HTMLMediaElement | null) => {
  const { methods, element } = getFullscreenMethods(inputElement);

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
          ? document?.[methods.exitFullscreen]?.()
          : element?.[methods.exitFullscreen]?.() ?? null;

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
  const { methods } = getFullscreenMethods();

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
  const { methods } = getFullscreenMethods();

  if (methods) {
    document.removeEventListener(methods.fullscreenchange, callback, false);

    return true;
  }

  return false;
};

const getFullscreenMethods = (element?: HTMLMediaElement | null) => {
  if (isClient()) {
    for (const methods of methodsList) {
      const exitFullscreenMethod = methods.exitFullscreen;

      if (exitFullscreenMethod in document) {
        return { methods, element: element as HTMLVideoElement };
      }
    }

    if (element && iosMethods.requestFullscreen in element) {
      return { methods: iosMethods, element: element as HTMLVideoElement };
    }
  }

  return { methods: null };
};
