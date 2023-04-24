import fetch from 'cross-fetch';

import { isClient } from '../utils';

/**
 * Checks if WebRTC WHEP can play in the browser.
 */
export const isWebRTCSupported = () => {
  if (!isClient()) {
    return false;
  }

  const hasRTCPeerConnection = !!(
    window.RTCPeerConnection ||
    window.webkitRTCPeerConnection ||
    window.mozRTCPeerConnection
  );

  const hasGetUserMedia = !!(
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia
  );

  const hasRTCDataChannel = !!(
    window.RTCDataChannel ||
    window.webkitRTCDataChannel ||
    window.mozRTCDataChannel
  );

  return hasRTCPeerConnection && hasGetUserMedia && hasRTCDataChannel;
};

let peerConnection: RTCPeerConnection | null = null;
let stream: MediaStream | null = null;

function createPeerConnection(): RTCPeerConnection | null {
  const RTCPeerConnectionConstructor =
    window.RTCPeerConnection ||
    window.webkitRTCPeerConnection ||
    window.mozRTCPeerConnection;

  if (RTCPeerConnectionConstructor) {
    return new RTCPeerConnectionConstructor();
  }

  return null;
}

/**
 * Example implementation of a client that uses WHEP to playback video over WebRTC.
 *
 * https://www.ietf.org/id/draft-murillo-whep-00.html
 */
export const createNewWHEP = <TElement extends HTMLMediaElement>(
  source: string,
  element: TElement,
  callbacks?: {
    onError?: (data: Error) => void;
  },
): {
  destroy: () => void;
} => {
  stream = new MediaStream();

  /**
   * Create a new WebRTC connection, using public STUN servers with ICE,
   * allowing the client to discover its own IP address.
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
        callbacks?.onError?.(e as Error);
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
        }
      } catch (e) {
        callbacks?.onError?.(e as Error);
      }
    });

    peerConnection.addEventListener('negotiationneeded', async (_ev) => {
      try {
        await negotiateConnectionWithClientOffer(peerConnection, source);
      } catch (e) {
        console.log(e);
        callbacks?.onError?.(e as Error);
      }
    });
  }

  return {
    destroy: () => {
      // Remove the WebRTC source
      if (element) {
        element.srcObject = null;
      }
      peerConnection?.close();
    },
  };
};

/**
 * Performs the actual SDP exchange.
 *
 * 1. Constructs the client's SDP offer
 * 2. Sends the SDP offer to the server,
 * 3. Awaits the server's offer.
 *
 * SDP describes what kind of media we can send and how the server and client communicate.
 *
 * https://developer.mozilla.org/en-US/docs/Glossary/SDP
 * https://www.ietf.org/archive/id/draft-ietf-wish-whip-01.html#name-protocol-operation
 */
async function negotiateConnectionWithClientOffer(
  peerConnection: RTCPeerConnection | null | undefined,
  endpoint: string | null | undefined,
) {
  if (peerConnection && endpoint) {
    /** https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/createOffer */
    const offer = await peerConnection.createOffer();
    /** https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/setLocalDescription */
    await peerConnection.setLocalDescription(offer);

    /** Wait for ICE gathering to complete */
    const ofr = await waitToCompleteICEGathering(peerConnection);
    if (!ofr) {
      throw Error('failed to gather ICE candidates for offer');
    }

    /**
     * This response contains the server's SDP offer.
     * This specifies how the client should communicate,
     * and what kind of media client and server have negotiated to exchange.
     */
    const response = await postSDPOffer(endpoint, ofr.sdp);
    if (response.ok) {
      const answerSDP = await response.text();
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription({ type: 'answer', sdp: answerSDP }),
      );
      return response.headers.get('Location');
    } else {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }
  }
}

async function postSDPOffer(endpoint: string, data: string) {
  return await fetch(endpoint, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'content-type': 'application/sdp',
    },
    body: data,
  });
}

/**
 * Receives an RTCPeerConnection and waits until
 * the connection is initialized or a timeout passes.
 *
 * https://www.ietf.org/archive/id/draft-ietf-wish-whip-01.html#section-4.1
 * https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/iceGatheringState
 * https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/icegatheringstatechange_event
 */
async function waitToCompleteICEGathering(peerConnection: RTCPeerConnection) {
  return new Promise<RTCSessionDescription | null>((resolve) => {
    /** Wait at most five seconds for ICE gathering. */
    setTimeout(() => {
      resolve(peerConnection.localDescription);
    }, 5000);
    peerConnection.onicegatheringstatechange = (_ev) => {
      if (peerConnection.iceGatheringState === 'complete') {
        resolve(peerConnection.localDescription);
      }
    };
  });
}
