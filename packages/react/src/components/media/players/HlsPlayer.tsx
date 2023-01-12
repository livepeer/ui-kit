import { HlsPlayerProps as HlsPlayerCoreProps } from '@livepeer/core-react/components';
import { addMediaMetricsToInitializedStore } from 'livepeer/media/browser';
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
import { isAccessControlError, isStreamOfflineError } from './utils';

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
      onStreamStatusChange,
      onMetricsError,
      onAccessControlError,
      priority,
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

    const canUseHlsjs = React.useMemo(() => isHlsSupported(), []);

    React.useEffect(() => {
      const element = store.getState()._element;
      if (element && canUseHlsjs && src.src) {
        const onLive = (fullscreen: boolean) => {
          onStreamStatusChange?.(true);
          store.getState().setLive(fullscreen);
        };

        const onError = (error: HlsError) => {
          const cleanError = new Error(error.response?.data.toString());
          if (isStreamOfflineError(cleanError)) {
            onStreamStatusChange?.(false);
          } else if (isAccessControlError(cleanError)) {
            onAccessControlError?.(cleanError);
          }
          console.warn(cleanError.message);
        };

        const { destroy } = createNewHls(
          src.src,
          element,
          {
            onLive,
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
      onStreamStatusChange,
      onAccessControlError,
    ]);

    // use HLS.js if Media Source is supported, fallback to using a regular video player
    return canUseHlsjs ? (
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
        preload={priority ? 'auto' : 'metadata'}
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
