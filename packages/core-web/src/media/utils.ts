import { Src } from "@livepeer/core/media";
import { noop } from "@livepeer/core/utils";

export const isClient = () => typeof window !== "undefined";
export const ua = () =>
  isClient() ? window?.navigator?.userAgent?.toLowerCase() : "";
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

  const video = document.createElement("video");

  if (muted) {
    video.setAttribute("muted", "");
    video.muted = true;
  }

  if (playsinline) {
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
  }

  video.setAttribute("height", "0");
  video.setAttribute("width", "0");

  video.style.position = "fixed";
  video.style.top = "0";
  video.style.width = "0";
  video.style.height = "0";
  video.style.opacity = "0";

  // Promise wrapped this way to catch both sync throws and async rejections.
  // More info: https://github.com/tc39/proposal-promise-try
  new Promise((resolve) => resolve(video.play())).catch(noop);

  return Promise.resolve(!video.paused);
};

/**
 * Checks if the native HTML5 video player can play the mime type.
 */
export const canPlayMediaNatively = (src: Src): boolean => {
  if (isClient() && src?.mime) {
    if (src?.type?.includes("audio")) {
      const audio = document.createElement("audio");
      return audio.canPlayType(src.mime).length > 0;
    }

    const video = document.createElement("video");
    return video.canPlayType(src.mime).length > 0;
  }

  return true;
};
