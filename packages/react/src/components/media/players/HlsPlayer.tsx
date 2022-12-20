import { HlsPlayerProps as HlsPlayerCoreProps } from '@livepeer/core-react/components';
import {
  addMediaMetricsToInitializedStore,
  canPlayMediaNatively,
} from 'livepeer/media/browser';
import {
  HlsError,
  HlsVideoConfig,
  createNewHls,
  isHlsSupported,
} from 'livepeer/media/browser/hls';
import { styling } from 'livepeer/media/browser/styling';

import * as React from 'react';

import { MediaControllerContext } from '../../../context';
import { PosterSource } from '../Player';
import { VideoPlayer } from './VideoPlayer';

export type HlsPlayerProps = HlsPlayerCoreProps<
  HTMLVideoElement,
  PosterSource
> & {
  hlsConfig?: HlsVideoConfig;
};

export const HlsPlayer = React.forwardRef<HTMLVideoElement, HlsPlayerProps>(
  (props, ref) => {
    const {
      hlsConfig,
      src,
      autoPlay,
      title,
      loop,
      muted,
      poster,
      objectFit,
      onMetricsError,
      onAccessControlError,
    } = props;

    const store = React.useContext(MediaControllerContext);

    React.useEffect(() => {
      const { destroy } = addMediaMetricsToInitializedStore(
        store,
        src?.src,
        (e) => {
          onMetricsError?.(e as Error);
          console.error('Not able to report player metrics', e);
        },
      );

      return destroy;
    }, [onMetricsError, store, src]);

    const [canUseHlsjs, canPlayAppleMpeg] = React.useMemo(
      () => [
        isHlsSupported(),
        canPlayMediaNatively({
          ...src,
          mime: 'application/vnd.apple.mpegurl',
        }),
      ],
      [src],
    );

    React.useEffect(() => {
      const element = store.getState()._element;
      if (element && canUseHlsjs && !canPlayAppleMpeg && src.src) {
        const onError = (error: HlsError) => {
          const errorMessage = error.response?.data.toString();
          onAccessControlError?.(new Error(errorMessage));
          console.warn(errorMessage);
        };
        const { destroy } = createNewHls(
          src.src,
          element,
          {
            onLive: store.getState().setLive,
            onDuration: store.getState().onDurationChange,
            onCanPlay: store.getState().onCanPlay,
            onError,
          },
          {
            autoplay: autoPlay,
            ...hlsConfig,
          },
        );

        return () => {
          destroy();
        };
      }
    }, [
      autoPlay,
      hlsConfig,
      src,
      store,
      canUseHlsjs,
      canPlayAppleMpeg,
      onAccessControlError,
    ]);

    // if Media Source is supported and if HLS is not supported by default in the user's browser, use HLS.js
    // fallback to using a regular video player
    return !canPlayAppleMpeg && canUseHlsjs ? (
      <video
        className={styling.media.video({
          size: store.getState().fullscreen ? 'fullscreen' : objectFit,
        })}
        loop={loop}
        aria-label={title ?? 'Video player'}
        role="video"
        width="100%"
        height="100%"
        ref={ref}
        webkit-playsinline="true"
        playsInline
        autoPlay={autoPlay}
        muted={muted}
        poster={typeof poster === 'string' ? poster : undefined}
      />
    ) : (
      <VideoPlayer
        {...props}
        ref={ref}
        src={[
          {
            ...src,
            type: 'video',
          },
        ]}
      />
    );
  },
);

HlsPlayer.displayName = 'HlsPlayer';
