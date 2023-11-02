import { NOT_ACCEPTABLE_ERROR_MESSAGE } from '@livepeer/core';
import fetch from 'cross-fetch';

import { isClient } from '../utils';

/**
 * Checks if WebRTC is supported.
 */
export const isWebRTCSupported = () => {
  if (!isClient()) {
    return false;
  }

  const hasRTCPeerConnection = !!(
    window?.RTCPeerConnection ||
    window?.webkitRTCPeerConnection ||
    window?.mozRTCPeerConnection
  );

  const hasGetUserMedia = !!(
    navigator?.getUserMedia ||
    navigator?.mediaDevices?.getUserMedia ||
    navigator?.webkitGetUserMedia ||
    navigator?.mozGetUserMedia ||
    navigator?.msGetUserMedia
  );

  const hasRTCDataChannel = !!(
    window?.RTCDataChannel ||
    window?.webkitRTCDataChannel ||
    window?.mozRTCDataChannel
  );

  return hasRTCPeerConnection && hasGetUserMedia && hasRTCDataChannel;
};

export function createPeerConnection(
  host: string | null,
): RTCPeerConnection | null {
  const RTCPeerConnectionConstructor =
    window?.RTCPeerConnection ||
    window?.webkitRTCPeerConnection ||
    window?.mozRTCPeerConnection;

  // strip non-standard port number if present
  const hostNoPort = host?.split(':')[0];

  const iceServers = host
    ? [
        {
          urls: `stun:${hostNoPort}`,
        },
        {
          urls: `turn:${hostNoPort}`,
          username: 'livepeer',
          credential: 'livepeer',
        },
      ]
    : [];

  if (RTCPeerConnectionConstructor) {
    return new RTCPeerConnectionConstructor({ iceServers });
  }

  return null;
}

export type WebRTCVideoConfig = {
  /**
   * The timeout of the network requests made for the SDP negotiation, in ms.
   *
   * @default 10000
   */
  sdpTimeout?: number;
  /**
   * Disables the speedup/slowdown mechanic in WebRTC, to allow for non-distorted audio.
   */
  constant?: boolean;
};

const DEFAULT_TIMEOUT = 10000;

/**
 * Performs the actual SDP exchange.
 *
 * 1. Sends the SDP offer to the server,
 * 2. Awaits the server's offer.
 *
 * SDP describes what kind of media we can send and how the server and client communicate.
 *
 * https://developer.mozilla.org/en-US/docs/Glossary/SDP
 * https://www.ietf.org/archive/id/draft-ietf-wish-whip-01.html#name-protocol-operation
 */
export async function negotiateConnectionWithClientOffer(
  peerConnection: RTCPeerConnection | null | undefined,
  endpoint: string | null | undefined,
  ofr: RTCSessionDescription | null,
  config?: WebRTCVideoConfig,
): Promise<Date> {
  if (peerConnection && endpoint && ofr) {
    /**
     * This response contains the server's SDP offer.
     * This specifies how the client should communicate,
     * and what kind of media client and server have negotiated to exchange.
     */
    const response = await postSDPOffer(endpoint, ofr.sdp, config);
    if (response.ok) {
      const answerSDP = await response.text();
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription({ type: 'answer', sdp: answerSDP }),
      );

      const playheadUtc = response.headers.get('Playhead-Utc');

      return new Date(playheadUtc ?? new Date());
    } else if (response.status === 406) {
      throw new Error(NOT_ACCEPTABLE_ERROR_MESSAGE);
    } else {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }
  } else {
    throw new Error('Peer connection not defined.');
  }
}

/**
 * Constructs the client's SDP offer
 *
 * SDP describes what kind of media we can send and how the server and client communicate.
 *
 * https://developer.mozilla.org/en-US/docs/Glossary/SDP
 * https://www.ietf.org/archive/id/draft-ietf-wish-whip-01.html#name-protocol-operation
 */
export async function constructClientOffer(
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

    return ofr;
  }

  return null;
}

async function postSDPOffer(
  endpoint: string,
  data: string,
  config?: WebRTCVideoConfig,
) {
  const controller = new AbortController();
  const id = setTimeout(
    () => controller.abort(),
    config?.sdpTimeout ?? DEFAULT_TIMEOUT,
  );

  if (config?.constant) {
    const url = new URL(endpoint);
    url.searchParams.append('constant', 'true');
    endpoint = url.toString();
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'content-type': 'application/sdp',
    },
    body: data,
    signal: controller.signal,
  });

  clearTimeout(id);

  return response;
}

export async function getRedirectUrl(
  endpoint: string,
  abortController: AbortController,
  timeout?: number,
) {
  const id = setTimeout(
    () => abortController.abort(),
    timeout ?? DEFAULT_TIMEOUT,
  );

  try {
    const response = await fetch(endpoint, {
      method: 'HEAD',
      signal: abortController.signal,
    });

    clearTimeout(id);

    const parsedUrl = new URL(response.url);

    return parsedUrl;
  } catch (e) {
    return null;
  }
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

/**
 * Parses the ICE servers from the `Link` headers returned during SDP negotiation.
 */
// function parseIceServersFromLinkHeader(
//   iceString: string | null,
// ): NonNullable<RTCConfiguration['iceServers']> | null {
//   try {
//     const servers = iceString
//       ?.split(', ')
//       .map((serverStr) => {
//         const parts = serverStr.split('; ');
//         const server: NonNullable<RTCConfiguration['iceServers']>[number] = {
//           urls: '',
//         };

//         for (const part of parts) {
//           if (part.startsWith('stun:') || part.startsWith('turn:')) {
//             server.urls = part;
//           } else if (part.startsWith('username=')) {
//             server.username = part.slice('username="'.length, -1);
//           } else if (part.startsWith('credential=')) {
//             server.credential = part.slice('credential="'.length, -1);
//           }
//         }

//         return server;
//       })
//       .filter((server) => server.urls);

//     return servers && (servers?.length ?? 0) > 0 ? servers : null;
//   } catch (e) {
//     console.error(e);
//   }

//   return null;
// }
