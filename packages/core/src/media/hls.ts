import Hls, { ErrorTypes, Events, HlsConfig } from 'hls.js';

import { getMetricsReportingUrl, reportMediaMetrics } from './metrics';

export const VIDEO_HLS_INITIALIZED_ATTRIBUTE = 'data-hls-initialized';

export const isHlsSupported = () => Hls.isSupported();

export type VideoConfig = { autoplay?: boolean };
export type HlsVideoConfig = Partial<HlsConfig> & { autoplay?: boolean };

export const createNewHls = <TElement extends HTMLMediaElement>(
  source: string,
  element: TElement,
  setLive: (v: boolean) => void,
  setDuration: (v: number) => void,
  config?: HlsVideoConfig,
): {
  destroy: () => void;
} => {
  // do not attach twice
  if (element.getAttribute(VIDEO_HLS_INITIALIZED_ATTRIBUTE) === 'true') {
    return {
      destroy: () => {
        //
      },
    };
  }

  element.setAttribute(VIDEO_HLS_INITIALIZED_ATTRIBUTE, 'true');

  const hls = new Hls({
    // enableWorker: false,
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

    setLive(Boolean(live));
    setDuration(duration ?? 0);
  });

  hls.on(Events.MEDIA_ATTACHED, async () => {
    hls.loadSource(source);

    hls.on(Events.MANIFEST_PARSED, (_event, _data) => {
      if (config?.autoplay && element) {
        try {
          element.muted = true;
          // element.play();
        } catch (e) {
          console.log(
            'Unable to autoplay prior to user interaction with the dom.',
          );
        }
      }
    });

    const metricReportingUrl = await getMetricsReportingUrl(source);
    if (metricReportingUrl) {
      reportMediaMetrics(element, metricReportingUrl);
    } else {
      console.log(
        'Not able to report player metrics given the source url',
        source,
      );
    }
  });

  hls.on(Events.ERROR, function (_event, data) {
    if (data.fatal) {
      switch (data.type) {
        case ErrorTypes.NETWORK_ERROR:
          hls?.startLoad();
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
