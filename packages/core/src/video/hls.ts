import Hls, { ErrorTypes, Events, HlsConfig } from 'hls.js';

import { getMetricsReportingUrl, reportVideoMetrics } from './metrics';

export const isHlsSupported = () => Hls.isSupported();

export type VideoConfig = { autoplay?: boolean };
export type HlsVideoConfig = Partial<HlsConfig> & { autoplay?: boolean };

export const createNewHls = (
  source: string,
  element: HTMLMediaElement,
  config?: HlsVideoConfig,
): {
  destroy: () => void;
} => {
  const hls = new Hls({
    // enableWorker: false,
    ...config,
  });

  if (element) {
    hls.attachMedia(element);
  }

  hls.on(Events.MEDIA_ATTACHED, async () => {
    hls.loadSource(source);

    hls.on(Events.MANIFEST_PARSED, () => {
      if (config?.autoplay) {
        try {
          element?.play();
        } catch (e) {
          console.log(
            'Unable to autoplay prior to user interaction with the dom.',
          );
        }
      }
    });

    const metricReportingUrl = await getMetricsReportingUrl(source);
    if (metricReportingUrl) {
      reportVideoMetrics(element, metricReportingUrl);
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
          hls.startLoad();
          break;
        case ErrorTypes.MEDIA_ERROR:
          hls.recoverMediaError();
          break;
        default:
          hls.destroy();
          break;
      }
    }
  });

  return {
    destroy: () => {
      hls?.destroy();
    },
  };
};
