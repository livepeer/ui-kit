import Hls, { ErrorTypes, Events, HlsConfig } from 'hls.js';
import React, { RefObject, VideoHTMLAttributes, useEffect } from 'react';

import { reportVideoMetrics } from '../utils/videoMetrics';

export interface GenericHlsVideoPlayerProps
  extends VideoHTMLAttributes<HTMLVideoElement> {
  hlsConfig?: HlsConfig;
  playerRef?: RefObject<HTMLVideoElement>;
  autoPlay?: boolean;
  controls?: boolean;
  width?: string | number;
}

export interface HlsVideoPlayerProps extends GenericHlsVideoPlayerProps {
  src: string;
}

export function HlsVideoPlayer({
  hlsConfig,
  playerRef = React.createRef<HTMLVideoElement>(),
  src,
  autoPlay = true,
  controls = true,
  width = '100%',
  ...props
}: HlsVideoPlayerProps) {
  useEffect(() => {
    let hls: Hls;

    function _initPlayer() {
      hls?.destroy();

      const newHls = new Hls({
        enableWorker: false,
        ...hlsConfig,
      });

      if (playerRef.current !== null) {
        newHls.attachMedia(playerRef.current);
      }

      newHls.on(Events.MEDIA_ATTACHED, () => {
        newHls.loadSource(src);

        newHls.on(Events.MANIFEST_PARSED, () => {
          if (autoPlay) {
            playerRef?.current
              ?.play()
              .catch(() =>
                console.log(
                  'Unable to autoplay prior to user interaction with the dom.',
                ),
              );
          }
        });

        // TODO: re-enable after testing and before merging
        // const metricReportingUrl = createMetricsReportingUrl(src);
        // if (metricReportingUrl) {
        //   reportVideoMetrics(playerRef.current, metricReportingUrl);
        // }
        reportVideoMetrics(
          playerRef.current,
          'wss://patchy.ddvtech.com/mist/json_bunny.js',
        );
      });

      newHls.on(Events.ERROR, function (_event, data) {
        if (data.fatal) {
          switch (data.type) {
            case ErrorTypes.NETWORK_ERROR:
              newHls.startLoad();
              break;
            case ErrorTypes.MEDIA_ERROR:
              newHls.recoverMediaError();
              break;
            default:
              _initPlayer();
              break;
          }
        }
      });

      hls = newHls;
    }

    if (typeof window !== 'undefined') {
      // Check for Media Source support
      if (Hls.isSupported()) {
        _initPlayer();
      }
    }

    return () => {
      hls?.destroy();
    };
  }, [autoPlay, hlsConfig, playerRef, src]);

  // If Media Source is supported, use HLS.js to play video
  if (typeof window !== 'undefined' && Hls.isSupported())
    return (
      <video ref={playerRef} controls={controls} width={width} {...props} />
    );

  // Fallback to using a regular video player if HLS is supported by default in the user's browser
  return (
    <video
      ref={playerRef}
      src={src}
      autoPlay={autoPlay}
      controls={controls}
      width={width}
      {...props}
    />
  );
}
