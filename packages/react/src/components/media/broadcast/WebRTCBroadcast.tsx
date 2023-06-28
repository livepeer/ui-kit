import { MediaControllerState } from 'livepeer';
import { styling } from 'livepeer/media/browser/styling';
import {
  WebRTCConnectedPayload,
  WebRTCVideoConfig,
  changeVideoSource,
  createNewWHIP,
} from 'livepeer/media/browser/webrtc';

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
  _setDeviceIds,
}: MediaControllerState<HTMLMediaElement, MediaStream>) => ({
  _element,
  setLive,
  fullscreen,
  togglePlay,
  _updateMediaStream,
  deviceIds,
  _setDeviceIds,
});

export type WebRTCBroadcastProps = Omit<
  BroadcastProps,
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
  } = props;

  const store = React.useContext(MediaControllerContext);

  const {
    _element,
    setLive,
    fullscreen,
    togglePlay,
    _setDeviceIds,
    _updateMediaStream,
  } = useMediaController(mediaControllerSelector);

  const [transceivers, setTransceivers] = React.useState<{
    audio: RTCRtpTransceiver;
    video: RTCRtpTransceiver;
  } | null>(null);

  const onConnected = React.useCallback(
    async (payload: WebRTCConnectedPayload) => {
      _updateMediaStream(payload.stream);
      setTransceivers({
        audio: payload.audioTransceiver,
        video: payload.videoTransceiver,
      });
      _setDeviceIds({
        audio:
          payload?.audioTransceiver?.sender?.track?.getSettings()?.deviceId,
        video:
          payload?.videoTransceiver?.sender?.track?.getSettings()?.deviceId,
      });
      onBroadcastError?.(null);
      togglePlay?.(true);
      setLive(true);
    },
    [setLive, onBroadcastError, togglePlay, _setDeviceIds, _updateMediaStream],
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
    webrtcConfig,
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
        if (
          (state.deviceIds?.audio !== prevState.deviceIds?.audio ||
            state.deviceIds?.video !== prevState.deviceIds?.video) &&
          state._element &&
          transceivers &&
          state._mediaStream
        ) {
          changeVideoSource({
            source: {
              videoDeviceId: state.deviceIds?.video ?? undefined,
              audioDeviceId: state.deviceIds?.audio ?? undefined,
            },
            prevMediaStream: state._mediaStream,
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

  // React.useEffect(() => {
  //   console.log({
  //     vidId: transceivers?.video?.sender.track?.id,
  //     deviceIds,
  //   });

  // }, [
  //   _element,
  //   transceivers,
  //   onConnected,
  //   aspectRatio,
  //   onErrorComposed,
  //   deviceIds,
  // ]);

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
