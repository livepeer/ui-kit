import { noop } from '../utils';
import { MimeType } from './mime';

export const isClient = () => typeof window !== 'undefined';
export const ua = () =>
  isClient() ? window?.navigator?.userAgent?.toLowerCase() : '';
export const isIos = () => /iphone|ipad|ipod|ios|CriOS|FxiOS/.test(ua());
export const isAndroid = () => /android/.test(ua());
export const isMobile = () => isClient() && (isIos() || isAndroid());
export const isIphone = () =>
  isClient() && /(iPhone|iPod)/gi.test(window?.navigator?.platform);
export const isFirefox = () => /firefox/.test(ua());
export const isChrome = () => isClient() && !!window?.chrome;
export const isSafari = () =>
  Boolean(
    isClient() &&
      !isChrome() &&
      (window?.safari || isIos() || /(apple|safari)/.test(ua())),
  );

export const isReactNative = (): boolean => {
  return (
    typeof navigator !== 'undefined' &&
    typeof navigator.product === 'string' &&
    navigator.product === 'ReactNative'
  );
};

export const origin = () =>
  isClient() &&
  window?.location?.protocol &&
  window?.location?.protocol !== 'file:' &&
  window?.location?.hostname
    ? `${window.location.protocol}//${window.location.hostname}`
    : undefined;

/**
 * Returns the current version of Safari. Defaults to `0` if unknown.
 */
export const currentSafariVersion = (): number => {
  return isClient()
    ? Number((/Safari\/(\d+)/.exec(navigator.userAgent) ?? ['', 0])[1])
    : 0;
};

/**
 * Checks if a video player can enter fullscreen.
 *
 * @see {@link https://developer.apple.com/documentation/webkitjs/htmlvideoelement/1633500-webkitenterfullscreen}
 */
// export const canFullscreenVideo = (): boolean => {
//   if (!isClient()) return false;
//   const video = document.createElement('video');
//   return isFunction(video.webkitEnterFullscreen);
// };

/**
 * Checks whether the `IntersectionObserver` API is available.
 */
// export const canObserveIntersection = (): boolean => {
//   return isClient() && !isUndefined(window.IntersectionObserver);
// };

/**
 * Checks if the ScreenOrientation API is available.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Screen/orientation}
 */
// export const canOrientScreen = (): boolean => {
//   return (
//     isClient() &&
//     !isUndefined(screen.orientation) &&
//     isFunction(screen.orientation.lock) &&
//     isFunction(screen.orientation.unlock)
//   );
// };

/**
 * Checks if the screen orientation can be changed.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Screen/orientation}
 */
// export const canRotateScreen = (): boolean => {
//   return (
//     isClient() &&
//     !isUndefined(window.screen.orientation) &&
//     !isUndefined(window.screen.orientation.lock)
//   );
// };

/**
 * Reduced motion iOS & MacOS setting.
 *
 * @see {@link https://webkit.org/blog/7551/responsive-design-for-motion/}
 */
export const isReducedMotionPreferred = (): boolean => {
  return (
    isClient() &&
    'matchMedia' in window &&
    window.matchMedia('(prefers-reduced-motion)').matches
  );
};

/**
 * Checks if the native HTML5 video player can enter picture-in-picture (PIP) mode when using
 * the Chrome browser.
 *
 * @see {@link https://developers.google.com/web/updates/2018/10/watch-video-using-picture-in-picture}
 */
// export const canUsePiPInChrome = (): boolean => {
//   if (!isClient()) return false;
//   const video = document.createElement('video');
//   return !!document.pictureInPictureEnabled && !video.disablePictureInPicture;
// };

/**
 * Checks if the native HTML5 video player can enter picture-in-picture (PIP) mode when using
 * the desktop Safari browser, iOS Safari appears to "support" PiP through the check, however PiP
 * does not function.
 *
 * @see {@link https://developer.apple.com/documentation/webkitjs/adding_picture_in_picture_to_your_safari_media_controls}
 */
// export const canUsePiPInSafari = (): boolean => {
//   if (!isClient()) return false;

//   const video = document.createElement('video');

//   return (
//     isFunction(video.webkitSupportsPresentationMode) &&
//     isFunction(video.webkitSetPresentationMode) &&
//     !isIphone()
//   );
// };

/**
 * Checks if the native HTML5 video player can enter PIP.
 */
// export const canUsePiP = (): boolean => {
//   return canUsePiPInChrome() || canUsePiPInSafari();
// };

/**
 * To detect autoplay, we create a video element and call play on it, if it is `paused` after
 * a `play()` call, autoplay is supported. Although this unintuitive, it works across browsers
 * and is currently the lightest way to detect autoplay without using a data source.
 *
 * @see {@link https://github.com/ampproject/amphtml/blob/9bc8756536956780e249d895f3e1001acdee0bc0/src/utils/video.js#L25}
 */
export const canAutoplay = (
  muted = true,
  playsinline = true,
): Promise<boolean> => {
  if (!isClient()) return Promise.resolve(false);

  const video = document.createElement('video');

  if (muted) {
    video.setAttribute('muted', '');
    video.muted = true;
  }

  if (playsinline) {
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
  }

  video.setAttribute('height', '0');
  video.setAttribute('width', '0');

  video.style.position = 'fixed';
  video.style.top = '0';
  video.style.width = '0';
  video.style.height = '0';
  video.style.opacity = '0';

  // Promise wrapped this way to catch both sync throws and async rejections.
  // More info: https://github.com/tc39/proposal-promise-try
  new Promise((resolve) => resolve(video.play())).catch(noop);

  return Promise.resolve(!video.paused);
};

/**
 * Checks if the native HTML5 video player can play the mime type.
 */
export const canPlayMediaNatively = (type: MimeType): boolean => {
  if (isClient()) {
    // TODO fix this to better support audio mime types
    if (type.includes('audio')) {
      const audio = document.createElement('audio');
      return audio.canPlayType(type).length > 0;
    } else {
      const video = document.createElement('video');
      return video.canPlayType(type).length > 0;
    }
  }

  return true;
};
