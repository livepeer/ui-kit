import Hls, { ErrorTypes, Events, HlsConfig } from 'hls.js';

// import { createMetricsReportingUrl, reportVideoMetrics } from './metrics';

const VIDEO_HLS_INITIALIZED_ATTRIBUTE = 'data-hls-initialized';

export const isHlsSupported = () => Hls.isSupported();

export type VideoConfig = { autoplay?: boolean };
export type HlsVideoConfig = Partial<HlsConfig> & { autoplay?: boolean };

export const createNewHls = <TElement extends HTMLMediaElement>(
  source: string,
  element: TElement,
  config?: HlsVideoConfig,
): {
  destroy: () => void;
} => {
  // do not attach twice
  if (element.getAttribute(VIDEO_HLS_INITIALIZED_ATTRIBUTE) === 'true') {
    return {
      destroy: () => {
        return;
      },
    };
  }

  element.setAttribute(VIDEO_HLS_INITIALIZED_ATTRIBUTE, 'true');

  const hls = new Hls({
    // enableWorker: false,
    ...config,
  });

  if (element) {
    hls.attachMedia(element);
  }

  hls.on(Events.MEDIA_ATTACHED, () => {
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

    // const metricReportingUrl = createMetricsReportingUrl(source);
    // if (metricReportingUrl) {
    //   reportVideoMetrics(element, metricReportingUrl);
    // } else {
    //   console.log(
    //     'Not able to report player metrics given the source url',
    //     source,
    //   );
    // }
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
