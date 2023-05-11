import { WebRTCSrc } from 'livepeer';
import { styling } from 'livepeer/media/browser/styling';
import {
  WebRTCVideoConfig,
  createNewWHEP,
} from 'livepeer/media/browser/webrtc';
import * as React from 'react';

import { VideoPlayerProps } from '.';

import { MediaControllerContext } from '../../../../context';

export type WebRTCVideoPlayerProps = Omit<
  VideoPlayerProps,
  'src' | 'hlsConfig'
> & {
  src: WebRTCSrc;
  fullscreen: boolean;
  webrtcConfig?: WebRTCVideoConfig;
};

export const WebRTCVideoPlayer = React.forwardRef<
  HTMLVideoElement,
  WebRTCVideoPlayerProps
>((props, ref) => {
  const {
    src,
    autoPlay,
    title,
    loop,
    muted,
    poster,
    objectFit,
    fullscreen,
    onPlaybackError,
    priority,
    webrtcConfig,
  } = props;

  const store = React.useContext(MediaControllerContext);

  const onConnected = React.useCallback(async () => {
    onPlaybackError?.(null);
    store.getState().setLive(true);
  }, [onPlaybackError, store]);

  React.useEffect(() => {
    const element = store.getState()._element;

    if (element) {
      const onErrorComposed = (error: Error) => {
        const cleanError = new Error(
          error?.message?.toString?.() ?? 'Error with WebRTC',
        );

        onPlaybackError?.(cleanError);
      };

      const { destroy } = createNewWHEP(
        src?.src,
        element,
        {
          onConnected,
          onError: onErrorComposed,
        },
        webrtcConfig,
      );

      const unsubscribe = store.subscribe((state, prevState) => {
        if (
          state?.metadata?.bframes &&
          state?.metadata?.bframes !== prevState.metadata?.bframes
        ) {
          onPlaybackError(
            new Error(
              'Metadata indicates that WebRTC playback contains bframes.',
            ),
          );
        }
      });

      return () => {
        unsubscribe();
        destroy();
      };
    }
  }, [autoPlay, store, onConnected, src, onPlaybackError]);

  return (
    <video
      className={styling.media.video({
        size: fullscreen ? 'fullscreen' : objectFit,
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
  );
});
