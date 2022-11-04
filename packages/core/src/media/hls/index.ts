import Hls, { ErrorData, ErrorTypes, Events, HlsConfig } from 'hls.js';

import { noop } from '../../utils';

import { isClient } from '../browser';

// errors which trigger an exponential backoff
const backoffRetryErrors = [
  // custom error to indicate invalid JWT was provided
  'Shutting down since this session is not allowed to view this stream',
  // custom error to indicate stream could not be opened
  'Stream open failed',
] as const;

export const VIDEO_HLS_INITIALIZED_ATTRIBUTE = 'data-hls-initialized';

export type HlsError = ErrorData;

export type VideoConfig = { autoplay?: boolean };
export type HlsVideoConfig = Partial<HlsConfig> & { autoplay?: boolean };

/**
 * Checks if hls.js can play in the browser.
 */
export const isHlsSupported = () => (isClient() ? Hls.isSupported() : true);

/**
 * Create an hls.js instance and attach to the provided media element.
 */
export const createNewHls = <TElement extends HTMLMediaElement>(
  source: string,
  element: TElement,
  callbacks?: {
    onLive?: (v: boolean) => void;
    onDuration?: (v: number) => void;
    onCanPlay?: () => void;
    onError?: (data: HlsError) => void;
  },
  config?: HlsVideoConfig,
): {
  destroy: () => void;
} => {
  // do not attach twice
  if (element.getAttribute(VIDEO_HLS_INITIALIZED_ATTRIBUTE) === 'true') {
    return {
      destroy: noop,
    };
  }

  element.setAttribute(VIDEO_HLS_INITIALIZED_ATTRIBUTE, 'true');

  const hls = new Hls({
    maxBufferLength: 15,
    maxMaxBufferLength: 60,
    ...config,
  });

  const onDestroy = () => {
    hls?.destroy?.();
    element?.removeAttribute?.(VIDEO_HLS_INITIALIZED_ATTRIBUTE);
  };

  if (element) {
    hls.attachMedia(element);
  }

  hls.on(Events.LEVEL_LOADED, async (_e, data) => {
    const { live, totalduration: duration } = data.details;

    callbacks?.onLive?.(Boolean(live));
    callbacks?.onDuration?.(duration ?? 0);
  });

  hls.on(Events.MEDIA_ATTACHED, async () => {
    hls.loadSource(source);

    hls.on(Events.MANIFEST_PARSED, (_event, _data) => {
      callbacks?.onCanPlay?.();

      if (config?.autoplay && element) {
        try {
          element.muted = true;
        } catch (e) {
          console.log(
            'Unable to autoplay prior to user interaction with the dom.',
          );
        }
      }
    });
  });

  let retryCount = 0;

  hls.on(Events.ERROR, async (_event, data) => {
    if (data.fatal) {
      callbacks?.onError?.(data);
      const response = data?.response?.data?.toString() ?? '';

      switch (data.type) {
        case ErrorTypes.NETWORK_ERROR:
          if (backoffRetryErrors.some((error) => response.includes(error))) {
            await new Promise((r) => setTimeout(r, 1000 * ++retryCount));
            hls?.recoverMediaError();
          } else {
            hls?.startLoad();
          }
          break;
        case ErrorTypes.MEDIA_ERROR:
          hls?.recoverMediaError();
          break;
        default:
          onDestroy();
          break;
      }
    }
  });

  return {
    destroy: onDestroy,
  };
};
