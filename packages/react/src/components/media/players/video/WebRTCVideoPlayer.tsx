import { WebRTCSrc } from 'livepeer';
import { styling } from 'livepeer/media/browser/styling';
import { createNewWHEP } from 'livepeer/media/browser/webrtc';
import * as React from 'react';

import { VideoPlayerProps } from './VideoPlayer';
import { MediaControllerContext } from '../../../../context';
import { isAccessControlError, isStreamOfflineError } from '../utils';

export type WebRTCVideoPlayerProps = Omit<VideoPlayerProps, 'src'> & {
  src: WebRTCSrc;
  fullscreen: boolean;
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
    onStreamStatusChange,
    onAccessControlError,
    onError: onMiscError,
    priority,
  } = props;

  const store = React.useContext(MediaControllerContext);

  React.useEffect(() => {
    const element = store.getState()._element;

    if (element) {
      store.getState().setLive(true);

      const onError = (error: Error) => {
        const cleanError = new Error(
          error?.message?.toString?.() ?? 'Error with WebRTC',
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

      const { destroy } = createNewWHEP(src?.src, element, {
        onError,
      });

      return () => {
        onAccessControlError?.(null);
        destroy();
      };
    }
  }, [
    autoPlay,
    src,
    store,
    onStreamStatusChange,
    onAccessControlError,
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
    />
  );
});
