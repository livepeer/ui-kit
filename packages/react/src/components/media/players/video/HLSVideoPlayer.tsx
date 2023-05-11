import { ACCESS_CONTROL_ERROR_MESSAGE, HlsSrc } from 'livepeer';
import { HlsError, createNewHls } from 'livepeer/media/browser/hls';
import { styling } from 'livepeer/media/browser/styling';
import * as React from 'react';

import { VideoPlayerProps } from '.';
import { MediaControllerContext } from '../../../../context';

export type HLSVideoPlayerProps = Omit<
  VideoPlayerProps,
  'src' | 'webrtcConfig'
> & {
  src: HlsSrc;
  fullscreen: boolean;
};

export const HLSVideoPlayer = React.forwardRef<
  HTMLVideoElement,
  HLSVideoPlayerProps
>((props, ref) => {
  const {
    hlsConfig,
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
    allowCrossOriginCredentials,
  } = props;

  const store = React.useContext(MediaControllerContext);

  const onLive = React.useCallback(
    async (live: boolean) => {
      onPlaybackError?.(null);

      store.getState().setLive(live);
    },
    [onPlaybackError, store],
  );

  React.useEffect(() => {
    const element = store.getState()._element;

    if (element) {
      const onErrorComposed = (error: HlsError) => {
        const cleanError = new Error(
          error?.response?.data?.toString?.() ??
            ((error?.response as any)?.code === 401
              ? ACCESS_CONTROL_ERROR_MESSAGE
              : 'Error with HLS.js'),
        );

        onPlaybackError?.(cleanError);
      };

      const { destroy } = createNewHls(
        src?.src,
        element,
        {
          onLive,
          onDuration: store.getState().onDurationChange,
          onCanPlay: store.getState().onCanPlay,
          onError: onErrorComposed,
        },
        {
          autoplay: autoPlay,
          xhrSetup(xhr, _url) {
            xhr.withCredentials = Boolean(allowCrossOriginCredentials);
          },
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
    onLive,
    onPlaybackError,
    allowCrossOriginCredentials,
  ]);

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
      crossOrigin={
        allowCrossOriginCredentials ? 'use-credentials' : 'anonymous'
      }
    />
  );
});
