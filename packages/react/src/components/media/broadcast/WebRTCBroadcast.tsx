import {
  MediaControllerCallbackState,
  MediaControllerState,
  sanitizeMediaControllerState,
} from '@livepeer/core-web';
import { styling } from '@livepeer/core-web/media/browser/styling';
import {
  WebRTCConnectedPayload,
  WebRTCVideoConfig,
  changeMediaStream,
  createNewWHIP,
} from '@livepeer/core-web/media/browser/webrtc';

import * as React from 'react';

import { BroadcastProps } from '.';
import { MediaControllerContext, useMediaController } from '../../../context';

const mediaControllerSelector = ({
  _element,
  setLive,
  fullscreen,
  togglePlay,
  _updateMediaStream,
  deviceIds,
}: MediaControllerState<HTMLMediaElement, MediaStream>) => ({
  _element,
  setLive,
  fullscreen,
  togglePlay,
  _updateMediaStream,
  deviceIds,
});

export type WebRTCBroadcastProps = Omit<
  BroadcastProps<any>,
  'onError' | 'streamKey'
> & {
  webrtcConfig?: WebRTCVideoConfig;
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
    onPlaybackStatusUpdate,
    playbackStatusSelector,
  } = props;

  const store = React.useContext(MediaControllerContext);

  const stateSelector = React.useCallback(
    (state: MediaControllerCallbackState<HTMLMediaElement, MediaStream>) => {
      return playbackStatusSelector?.(state) ?? state;
    },
    [playbackStatusSelector],
  );

  React.useEffect(() => {
    return store.subscribe(stateSelector, (state, prevState) =>
      onPlaybackStatusUpdate?.(
        sanitizeMediaControllerState(
          state as MediaControllerState<HTMLMediaElement, MediaStream>,
        ),
        sanitizeMediaControllerState(
          prevState as MediaControllerState<HTMLMediaElement, MediaStream>,
        ),
      ),
    );
  }, [onPlaybackStatusUpdate, stateSelector, store]);

  const { _element, setLive, fullscreen, togglePlay, _updateMediaStream } =
    useMediaController(mediaControllerSelector);

  const [transceivers, setTransceivers] = React.useState<{
    audio: RTCRtpTransceiver;
    video: RTCRtpTransceiver;
  } | null>(null);

  const onConnected = React.useCallback(
    async (payload: WebRTCConnectedPayload) => {
      _updateMediaStream(payload.stream, {
        audio:
          payload?.audioTransceiver?.sender?.track?.getSettings()?.deviceId,
        video:
          payload?.videoTransceiver?.sender?.track?.getSettings()?.deviceId,
      });
      setTransceivers({
        audio: payload.audioTransceiver,
        video: payload.videoTransceiver,
      });
      onBroadcastError?.(null);
      togglePlay?.(true);
      setLive(true);
    },
    [setLive, onBroadcastError, togglePlay, _updateMediaStream],
  );

  const onErrorComposed = React.useCallback(
    (error: Error) => {
      const cleanError = new Error(
        error?.message?.toString?.() ?? 'Error with WebRTC',
      );

      onBroadcastError?.(cleanError);
    },
    [onBroadcastError],
  );

  React.useEffect(() => {
    if (_element && ingestUrl) {
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
    aspectRatio,
    _element,
    onConnected,
    ingestUrl,
    onBroadcastError,
    onErrorComposed,
  ]);

  React.useEffect(
    () =>
      store.subscribe((state, prevState) => {
        // if the media stream changes
        if (
          state._mediaStream?.id !== prevState._mediaStream?.id &&
          state._element &&
          transceivers &&
          state._mediaStream
        ) {
          changeMediaStream({
            newMediaStream: state._mediaStream,
            prevMediaStream: prevState._mediaStream,
            aspectRatio: aspectRatio ?? '16to9',
            element: state._element,
            videoTransceiver: transceivers.video,
            audioTransceiver: transceivers.audio,
            onConnected,
          }).catch((e) => onErrorComposed(e));
        }
      }),
    [store, transceivers, aspectRatio, onConnected, onErrorComposed],
  );

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
      muted
    />
  );
});
