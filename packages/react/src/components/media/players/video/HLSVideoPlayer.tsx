import {
  ACCESS_CONTROL_ERROR_MESSAGE,
  HlsSrc,
  MediaControllerState,
} from 'livepeer';
import { HlsError, createNewHls } from 'livepeer/media/browser/hls';
import { styling } from 'livepeer/media/browser/styling';
import * as React from 'react';

import { VideoPlayerProps } from '.';
import { useMediaController } from '../../../../context';

const mediaControllerSelector = ({
  setLive,
  onDurationChange,
  onCanPlay,
  _element,
}: MediaControllerState<HTMLMediaElement, MediaStream>) => ({
  setLive,
  onDurationChange,
  onCanPlay,
  _element,
});

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
    src,
    hlsConfig,
    autoPlay,
    title,
    loop,
    muted,
    poster,
    objectFit,
    fullscreen,
    playbackError,
    onPlaybackError,
    priority,
    allowCrossOriginCredentials,
  } = props;

  const { setLive, onCanPlay, onDurationChange, _element } = useMediaController(
    mediaControllerSelector,
  );

  const onLive = React.useCallback(
    async (live: boolean) => {
      onPlaybackError?.(null);

      setLive(live);
    },
    [onPlaybackError, setLive],
  );

  React.useEffect(() => {
    if (_element && src) {
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
        _element,
        {
          onLive,
          onDuration: onDurationChange,
          onCanPlay: onCanPlay,
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
        destroy?.();
      };
    }
  }, [
    autoPlay,
    hlsConfig,
    onDurationChange,
    onCanPlay,
    _element,
    src,
    onLive,
    onPlaybackError,
    allowCrossOriginCredentials,
  ]);

  return !playbackError?.type ? (
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
  ) : (
    <></>
  );
});
