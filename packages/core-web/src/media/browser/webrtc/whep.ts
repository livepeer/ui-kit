import {
  WebRTCVideoConfig,
  constructClientOffer,
  createPeerConnection,
  negotiateConnectionWithClientOffer,
} from './shared';

/**
 * Client that uses WHEP to playback video over WebRTC.
 *
 * https://www.ietf.org/id/draft-murillo-whep-00.html
 */
export const createNewWHEP = <TElement extends HTMLMediaElement>(
  source: string,
  element: TElement,
  callbacks?: {
    onConnected?: () => void;
    onError?: (data: Error) => void;
  },
  config?: WebRTCVideoConfig,
): {
  destroy: () => void;
} => {
  const abortController = new AbortController();

  let peerConnection: RTCPeerConnection | null = null;
  const stream = new MediaStream();

  const errorComposed = (e: Error) => {
    if (element) {
      element.srcObject = null;
    }

    callbacks?.onError?.(e as Error);
  };

  /**
   * Create a new WebRTC connection
   * https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Protocols#ice
   */
  peerConnection = createPeerConnection();

  if (peerConnection) {
    /** https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/addTransceiver */
    peerConnection.addTransceiver('video', {
      direction: 'recvonly',
    });
    peerConnection.addTransceiver('audio', {
      direction: 'recvonly',
    });

    /**
     * When new tracks are received in the connection, store local references,
     * so that they can be added to a MediaStream, and to the <video> element.
     *
     * https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/track_event
     */
    peerConnection.ontrack = async (event) => {
      try {
        if (stream) {
          const track = event.track;
          const currentTracks = stream.getTracks();
          const streamAlreadyHasVideoTrack = currentTracks.some(
            (track) => track.kind === 'video',
          );
          const streamAlreadyHasAudioTrack = currentTracks.some(
            (track) => track.kind === 'audio',
          );
          switch (track.kind) {
            case 'video':
              if (streamAlreadyHasVideoTrack) {
                break;
              }
              stream.addTrack(track);
              break;
            case 'audio':
              if (streamAlreadyHasAudioTrack) {
                break;
              }
              stream.addTrack(track);
              break;
            default:
              console.log('got unknown track ' + track);
          }
        }
      } catch (e) {
        errorComposed(e as Error);
      }
    };

    peerConnection.addEventListener('connectionstatechange', async (_ev) => {
      try {
        if (peerConnection?.connectionState === 'failed') {
          throw new Error('Failed to connect to peer.');
        }
        if (
          peerConnection?.connectionState === 'connected' &&
          !element.srcObject
        ) {
          element.srcObject = stream;
          callbacks?.onConnected?.();
        }
      } catch (e) {
        errorComposed(e as Error);
      }
    });

    peerConnection.addEventListener('negotiationneeded', async (_ev) => {
      try {
        const ofr = await constructClientOffer(peerConnection);

        await negotiateConnectionWithClientOffer(
          peerConnection,
          source,
          ofr,
          config?.sdpTimeout,
        );
      } catch (e) {
        errorComposed(e as Error);
      }
    });
  }

  return {
    destroy: () => {
      abortController?.abort?.();

      // Remove the WebRTC source
      if (element) {
        element.srcObject = null;
      }
      peerConnection?.close?.();
    },
  };
};
