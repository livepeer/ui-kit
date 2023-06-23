import { MediaControllerState } from 'livepeer';
import { styling } from 'livepeer/media/browser/styling';
import {
  WebRTCVideoConfig,
  WebRTCWHIPConfig,
  createNewWHIP,
} from 'livepeer/media/browser/webrtc';
import * as React from 'react';

import { BroadcastProps } from '.';
import { useMediaController } from '../../../context';

const mediaControllerSelector = ({
  _element,
  setLive,
  fullscreen,
  onCanPlay,
  togglePlay,
  _updateMediaStream,
  setVideo,
}: MediaControllerState<HTMLMediaElement, MediaStream>) => ({
  _element,
  setLive,
  fullscreen,
  onCanPlay,
  togglePlay,
  _updateMediaStream,
  setVideo,
});

export type WebRTCBroadcastProps = Omit<
  BroadcastProps,
  'onError' | 'streamKey'
> & {
  webrtcConfig?: WebRTCVideoConfig & WebRTCWHIPConfig;
  onBroadcastError: (error: Error | null) => void;
  ingestUrl: string | null;
};

export const WebRTCBroadcast = React.forwardRef<
  HTMLVideoElement,
  WebRTCBroadcastProps
>((props, ref) => {
  const {
    ingestUrl,
    title,
    aspectRatio,
    objectFit,
    webrtcConfig,
    onBroadcastError,
  } = props;

  const {
    _element,
    setLive,
    fullscreen,
    togglePlay,
    _updateMediaStream,
    setVideo,
  } = useMediaController(mediaControllerSelector);

  const onConnected = React.useCallback(
    async (mediaStream: MediaStream) => {
      setVideo(true);
      _updateMediaStream(mediaStream);
      onBroadcastError?.(null);
      togglePlay?.(true);
      setLive(true);
    },
    [setLive, onBroadcastError, togglePlay, _updateMediaStream, setVideo],
  );

  React.useEffect(() => {
    if (_element && ingestUrl) {
      const onErrorComposed = (error: Error) => {
        const cleanError = new Error(
          error?.message?.toString?.() ?? 'Error with WebRTC',
        );

        onBroadcastError?.(cleanError);
      };

      const { destroy } = createNewWHIP(
        ingestUrl,
        _element,
        aspectRatio ?? '16to9',
        {
          onConnected,
          onError: onErrorComposed,
        },
        webrtcConfig,
      );

      return () => {
        destroy?.();
      };
    }
  }, [
    webrtcConfig,
    aspectRatio,
    _element,
    onConnected,
    ingestUrl,
    onBroadcastError,
  ]);

  return (
    <video
      className={styling.media.video({
        size: fullscreen ? 'fullscreen' : objectFit,
      })}
      aria-label={title ?? 'Video player'}
      role="video"
      width="100%"
      height="100%"
      ref={ref}
      webkit-playsinline="true"
      playsInline
      // autoPlay={autoPlay}
      muted
      // poster={typeof poster === 'string' ? poster : undefined}
      // preload={priority ? 'auto' : 'metadata'}
    />
  );
});
