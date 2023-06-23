import { AspectRatio } from '@livepeer/core/media';
import fetch from 'cross-fetch';

import {
  WebRTCVideoConfig,
  constructClientOffer,
  createPeerConnection,
  getRedirectUrl,
  negotiateConnectionWithClientOffer,
} from './shared';

export type WebRTCWHIPConfig = {
  /**
   * The constraints applied to the broadcast media track.
   *
   * https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints
   */
  trackConstraints?: MediaTrackConstraints;
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
    onConnected?: (mediaStream: MediaStream) => void;
    onError?: (data: Error) => void;
  },
  config?: WebRTCVideoConfig & WebRTCWHIPConfig,
): {
  destroy: () => void;
} => {
  let destroyed = false;
  const abortController = new AbortController();

  let peerConnection: RTCPeerConnection | null = null;
  let stream: MediaStream | null = null;

  let disconnectStream: (() => void) | null = null;

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

  getRedirectUrl(ingestUrl, abortController, config?.sdpTimeout)
    .then((redirectUrl) => {
      if (destroyed || !redirectUrl) {
        return;
      }

      const redirectUrlString = redirectUrl.toString();

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
                !element.srcObject &&
                stream
              ) {
                element.srcObject = stream;
                callbacks?.onConnected?.(stream);
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
          .then((mediaStream) => {
            mediaStream.getTracks().forEach((track) => {
              const transceiver = peerConnection?.addTransceiver(track, {
                direction: 'sendonly',
              });
              if (track?.kind == 'video' && transceiver?.sender?.track) {
                transceiver.sender.track.applyConstraints(constraints);
              }
            });

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
