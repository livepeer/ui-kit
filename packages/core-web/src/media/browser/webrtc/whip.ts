import { AspectRatio } from '@livepeer/core/media';
import fetch from 'cross-fetch';

import {
  WebRTCVideoConfig,
  constructClientOffer,
  createPeerConnection,
  getRedirectUrl,
  negotiateConnectionWithClientOffer,
} from './shared';

export type WebRTCTrackContraints = {
  /**
   * The constraints applied to the broadcast media track.
   *
   * https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints
   */
  streamConstraints?: MediaStreamConstraints;
  /**
   * The device ID used to constrain the video track.
   */
  videoDeviceId?: string;
  /**
   * The device ID used to constrain the video track.
   */
  audioDeviceId?: string;
};

export type WebRTCConnectedPayload = {
  stream: MediaStream;
  videoTransceiver: RTCRtpTransceiver;
  audioTransceiver: RTCRtpTransceiver;
};

/**
 * Client that uses WHIP to broadcast video over WebRTC.
 *
 * https://www.ietf.org/archive/id/draft-ietf-wish-whip-01.html
 */
export const createNewWHIP = <TElement extends HTMLMediaElement>(
  ingestUrl: string,
  element: TElement,
  aspectRatio: AspectRatio,
  callbacks?: {
    onConnected?: (payload: WebRTCConnectedPayload) => void;
    onError?: (data: Error) => void;
  },
  config?: WebRTCVideoConfig,
): {
  destroy: () => void;
} => {
  let destroyed = false;
  const abortController = new AbortController();

  let peerConnection: RTCPeerConnection | null = null;
  let stream: MediaStream | null = null;
  let videoTransceiver: RTCRtpTransceiver | null = null;
  let audioTransceiver: RTCRtpTransceiver | null = null;

  let disconnectStream: (() => void) | null = null;

  getRedirectUrl(ingestUrl, abortController, config?.sdpTimeout)
    .then((redirectUrl) => {
      if (destroyed || !redirectUrl) {
        return;
      }

      const redirectUrlString = redirectUrl.toString().replace('video+', '');

      /**
       * Create a new WebRTC connection, using public STUN servers with ICE,
       * allowing the client to discover its own IP address.
       * https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Protocols#ice
       */
      peerConnection = createPeerConnection(redirectUrl.host);

      if (peerConnection) {
        peerConnection.addEventListener('negotiationneeded', async (_ev) => {
          try {
            const ofr = await constructClientOffer(
              peerConnection,
              redirectUrlString,
            );

            await negotiateConnectionWithClientOffer(
              peerConnection,
              redirectUrlString,
              ofr,
              config?.sdpTimeout,
            );
          } catch (e) {
            callbacks?.onError?.(e as Error);
          }
        });

        peerConnection.addEventListener(
          'connectionstatechange',
          async (_ev) => {
            try {
              if (peerConnection?.connectionState === 'failed') {
                throw new Error('Failed to connect to peer.');
              }

              if (
                peerConnection?.connectionState === 'connected' &&
                stream &&
                audioTransceiver &&
                videoTransceiver
              ) {
                element.srcObject = stream;

                callbacks?.onConnected?.({
                  stream,
                  videoTransceiver,
                  audioTransceiver,
                });
              }
            } catch (e) {
              callbacks?.onError?.(e as Error);
            }
          },
        );

        /**
         * While the connection is being initialized, ask for camera and microphone permissions and
         * add video and audio tracks to the peerConnection.
         *
         * https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
         */
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: true })
          .then(async (mediaStream) => {
            const newVideoTrack = mediaStream?.getVideoTracks?.()?.[0] ?? null;
            const newAudioTrack = mediaStream?.getAudioTracks?.()?.[0] ?? null;

            if (newVideoTrack) {
              await newVideoTrack.applyConstraints(getConstraints(aspectRatio));

              videoTransceiver =
                peerConnection?.addTransceiver(newVideoTrack, {
                  direction: 'sendonly',
                }) ?? null;
            }

            if (newAudioTrack) {
              audioTransceiver =
                peerConnection?.addTransceiver(newAudioTrack, {
                  direction: 'sendonly',
                }) ?? null;
            }

            stream = mediaStream;
          })
          .catch((e) => callbacks?.onError?.(e as Error));

        /**
         * Terminate the streaming session by notifying the WHIP server by sending a DELETE request
         *
         * Once this is called, this instance of this WHIPClient cannot be reused.
         */
        disconnectStream = () => {
          fetch(redirectUrlString, {
            method: 'DELETE',
            mode: 'cors',
          }).catch((e) => callbacks?.onError?.(e as Error));
        };
      }
    })
    .catch((e) => callbacks?.onError?.(e as Error));

  return {
    destroy: () => {
      disconnectStream?.();
      destroyed = true;
      abortController?.abort?.();

      // Remove the WebRTC source
      if (element) {
        element.srcObject = null;
      }
      peerConnection?.close?.();

      // Stop using the local camera and microphone
      const tracks = stream?.getTracks?.() ?? [];
      for (const track of tracks) {
        track?.stop?.();
      }
    },
  };
};

/**
 * While the connection is being initialized, ask for camera and microphone permissions and
 * add video and audio tracks to the peerConnection.
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
 */
export const changeVideoSource = async <TElement extends HTMLMediaElement>({
  source,
  aspectRatio,
  element,
  prevMediaStream,
  onConnected,
  videoTransceiver,
  audioTransceiver,
}: {
  source: WebRTCTrackContraints;
  aspectRatio: AspectRatio;
  element: TElement;
  prevMediaStream: MediaStream;
  onConnected: (payload: WebRTCConnectedPayload) => void;
  videoTransceiver: RTCRtpTransceiver;
  audioTransceiver: RTCRtpTransceiver;
}) => {
  const mediaStream = await navigator.mediaDevices.getUserMedia(
    source?.streamConstraints ?? {
      video: source?.videoDeviceId
        ? {
            deviceId: source?.videoDeviceId,
          }
        : true,
      audio: source?.audioDeviceId
        ? {
            deviceId: source?.audioDeviceId,
          }
        : true,
    },
  );

  const prevVideoTrack = prevMediaStream?.getVideoTracks?.()?.[0] ?? null;
  const prevAudioTrack = prevMediaStream?.getAudioTracks?.()?.[0] ?? null;

  const newVideoTrack = mediaStream?.getVideoTracks?.()?.[0] ?? null;
  const newAudioTrack = mediaStream?.getAudioTracks?.()?.[0] ?? null;

  if (newVideoTrack && source?.videoDeviceId) {
    await newVideoTrack.applyConstraints(getConstraints(aspectRatio));
    await videoTransceiver.sender.replaceTrack(newVideoTrack);
    newVideoTrack.enabled = prevVideoTrack?.enabled ?? true;
  }

  if (newAudioTrack && source?.audioDeviceId) {
    await audioTransceiver.sender.replaceTrack(newAudioTrack);
    newAudioTrack.enabled = prevAudioTrack?.enabled ?? true;
  }

  element.srcObject = mediaStream;

  onConnected({
    stream: mediaStream,
    videoTransceiver,
    audioTransceiver,
  });
};

export const getMediaDevices = (
  onDevicesUpdated: (devices: MediaDeviceInfo[]) => void,
) => {
  if (
    typeof navigator !== 'undefined' &&
    navigator?.mediaDevices?.enumerateDevices
  ) {
    const onDeviceChange = () => {
      navigator.mediaDevices
        .enumerateDevices()
        .then((devices) => onDevicesUpdated(devices));
    };

    navigator.mediaDevices.addEventListener('devicechange', onDeviceChange);

    onDeviceChange();

    return () => {
      navigator.mediaDevices.removeEventListener(
        'devicechange',
        onDeviceChange,
      );
    };
  }

  return () => {
    //
  };
};

const getConstraints = (aspectRatio: AspectRatio) => {
  const constraints: MediaTrackConstraints = {
    width: {
      ideal: 1280,
    },
    height: {
      ideal: 720,
    },
    aspectRatio: {
      ideal:
        aspectRatio === '9to16'
          ? 9 / 16
          : aspectRatio === '1to1'
          ? 1
          : aspectRatio === '21to9'
          ? 21 / 9
          : aspectRatio === '4to5'
          ? 4 / 5
          : 16 / 9,
    },
  };

  return constraints;
};
