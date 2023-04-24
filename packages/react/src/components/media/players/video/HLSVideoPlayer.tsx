import { HlsSrc } from 'livepeer';
import { HlsError, createNewHls } from 'livepeer/media/browser/hls';
import { styling } from 'livepeer/media/browser/styling';
import * as React from 'react';

import { VideoPlayerProps } from './VideoPlayer';
import { MediaControllerContext } from '../../../../context';
import {
  ACCESS_CONTROL_ERROR_MESSAGE,
  isAccessControlError,
  isStreamOfflineError,
} from '../utils';

export type HLSVideoPlayerProps = Omit<VideoPlayerProps, 'src'> & {
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
    onStreamStatusChange,
    onAccessControlError,
    onError: onMiscError,
    priority,
    allowCrossOriginCredentials,
  } = props;

  const store = React.useContext(MediaControllerContext);

  React.useEffect(() => {
    const element = store.getState()._element;

    if (element) {
      const onLive = (live: boolean) => {
        onAccessControlError?.(null);
        onStreamStatusChange?.(true);
        store.getState().setLive(live);
      };

      const onError = (error: HlsError) => {
        const cleanError = new Error(
          error?.response?.data?.toString?.() ??
            ((error?.response as any)?.code === 401
              ? ACCESS_CONTROL_ERROR_MESSAGE
              : 'Error with HLS.js'),
        );

        if (isStreamOfflineError(cleanError)) {
          onStreamStatusChange?.(false);
        } else if (isAccessControlError(cleanError)) {
          onAccessControlError?.(cleanError);
        } else {
          onMiscError?.(cleanError);
        }
        console.warn(cleanError.message);
      };

      const { destroy } = createNewHls(
        src?.src,
        element,
        {
          onLive,
          onDuration: store.getState().onDurationChange,
          onCanPlay: store.getState().onCanPlay,
          onError,
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
        onAccessControlError?.(null);
        destroy();
      };
    }
  }, [
    autoPlay,
    hlsConfig,
    src,
    store,
    onStreamStatusChange,
    onAccessControlError,
    allowCrossOriginCredentials,
    onMiscError,
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
