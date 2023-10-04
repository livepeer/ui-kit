import { AspectRatio } from '@livepeer/core/media';
import fetch from 'cross-fetch';

import {
  WebRTCVideoConfig,
  constructClientOffer,
  createPeerConnection,
  negotiateConnectionWithClientOffer,
} from './shared';

export type WebRTCTrackConstraints = {
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
  aspectRatio?: AspectRatio,
  callbacks?: {
    onConnected?: (payload: WebRTCConnectedPayload) => void;
    onError?: (data: Error) => void;
  },
  config?: WebRTCVideoConfig,
): {
  destroy: () => void;
} => {
  const abortController = new AbortController();

  let peerConnection: RTCPeerConnection | null = null;
  let stream: MediaStream | null = null;
  let videoTransceiver: RTCRtpTransceiver | null = null;
  let audioTransceiver: RTCRtpTransceiver | null = null;
  let deleteUrl: string | null = null;

  let disconnectStream: (() => void) | null = null;

  /**
   * Create a new WebRTC connection
   * https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Protocols#ice
   */
  peerConnection = createPeerConnection();

  if (peerConnection) {
    peerConnection.addEventListener('negotiationneeded', async (_ev) => {
      try {
        const ofr = await constructClientOffer(peerConnection);

        const response = await negotiateConnectionWithClientOffer(
          peerConnection,
          ingestUrl,
          ofr,
          config?.sdpTimeout,
        );

        deleteUrl = response?.url ?? null;
      } catch (e) {
        callbacks?.onError?.(e as Error);
      }
    });

    peerConnection.addEventListener('connectionstatechange', async (_ev) => {
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
    });

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
          await newVideoTrack.applyConstraints(
            getConstraints(aspectRatio ?? '16to9'),
          );

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

    disconnectStream = () => {
      if (!deleteUrl) {
        return;
      }
      fetch(deleteUrl, {
        method: 'DELETE',
        mode: 'cors',
      }).catch((e) => callbacks?.onError?.(e as Error));
    };
  }

  return {
    destroy: () => {
      disconnectStream?.();
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
 * Ask for camera and microphone permissions and add video and audio tracks to the peerConnection.
 * If a media stream is passed in, use this for the connection.
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
 */
export const changeMediaStream = async <TElement extends HTMLMediaElement>({
  newMediaStream,
  prevMediaStream,
  aspectRatio,
  element,
  onConnected,
  videoTransceiver,
  audioTransceiver,
}: {
  newMediaStream: MediaStream;
  prevMediaStream: MediaStream | null;

  aspectRatio: AspectRatio;
  element: TElement;

  onConnected: (payload: WebRTCConnectedPayload) => void;
  videoTransceiver: RTCRtpTransceiver;
  audioTransceiver: RTCRtpTransceiver;
}) => {
  const prevVideoTrack = prevMediaStream?.getVideoTracks?.()?.[0] ?? null;
  const prevAudioTrack = prevMediaStream?.getAudioTracks?.()?.[0] ?? null;

  const newVideoTrack = newMediaStream?.getVideoTracks?.()?.[0] ?? null;
  const newAudioTrack = newMediaStream?.getAudioTracks?.()?.[0] ?? null;

  if (newVideoTrack) {
    await newVideoTrack.applyConstraints(getConstraints(aspectRatio));
    await videoTransceiver.sender.replaceTrack(newVideoTrack);
    newVideoTrack.enabled = prevVideoTrack?.enabled ?? true;
  }

  if (newAudioTrack) {
    await audioTransceiver.sender.replaceTrack(newAudioTrack);
    newAudioTrack.enabled = prevAudioTrack?.enabled ?? true;
  }

  element.srcObject = newMediaStream;

  onConnected({
    stream: newMediaStream,
    videoTransceiver,
    audioTransceiver,
  });
};

/**
 * Ask for camera and microphone permissions and get the MediaStream for the given constraints.
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
 */
export const getUserMedia = async ({
  source,
}: {
  source: WebRTCTrackConstraints;
}) => {
  try {
    const newMediaStream = await navigator?.mediaDevices?.getUserMedia({
      ...(typeof source.streamConstraints === 'object'
        ? source.streamConstraints
        : {}),
      video: {
        ...(typeof source.streamConstraints?.video !== 'boolean'
          ? source.streamConstraints?.video
          : {}),
        ...(source?.videoDeviceId
          ? {
              deviceId: source?.videoDeviceId,
            }
          : {}),
      },
      audio: {
        ...(typeof source.streamConstraints?.audio !== 'boolean'
          ? source.streamConstraints?.audio
          : {}),
        ...(source?.audioDeviceId
          ? {
              deviceId: source?.audioDeviceId,
            }
          : {}),
      },
    });

    return newMediaStream ?? null;
  } catch (e) {
    console.error(e);
    return null;
  }
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

export const getDisplayMedia = async (options?: DisplayMediaStreamOptions) => {
  try {
    if (
      typeof navigator !== 'undefined' &&
      navigator?.mediaDevices?.getDisplayMedia
    ) {
      const mediaStream = await navigator.mediaDevices.getDisplayMedia(options);

      return mediaStream;
    }
  } catch (e) {
    console.error(e);
  }

  return null;
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
