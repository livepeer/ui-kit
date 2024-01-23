import {
  AccessControlParams,
  NOT_ACCEPTABLE_ERROR_MESSAGE,
} from "@livepeer/core";
import { isClient } from "../media/utils";

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
  const hostNoPort = host?.split(":")[0];

  const iceServers = host
    ? [
        {
          urls: `stun:${hostNoPort}`,
        },
        {
          urls: `turn:${hostNoPort}`,
          username: "livepeer",
          credential: "livepeer",
        },
      ]
    : [];

  if (RTCPeerConnectionConstructor) {
    return new RTCPeerConnectionConstructor({ iceServers });
  }

  return null;
}

const DEFAULT_TIMEOUT = 5000;

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
  controller: AbortController,
  accessControl: AccessControlParams,
  sdpTimeout: number | null,
): Promise<Date> {
  if (peerConnection && endpoint && ofr) {
    /**
     * This response contains the server's SDP offer.
     * This specifies how the client should communicate,
     * and what kind of media client and server have negotiated to exchange.
     */
    const response = await postSDPOffer(
      endpoint,
      ofr.sdp,
      controller,
      accessControl,
      sdpTimeout,
    );
    if (response.ok) {
      const answerSDP = await response.text();
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription({ type: "answer", sdp: answerSDP }),
      );

      const playheadUtc = response.headers.get("Playhead-Utc");

      return new Date(playheadUtc ?? new Date());
    }
    if (response.status === 406) {
      throw new Error(NOT_ACCEPTABLE_ERROR_MESSAGE);
    }

    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }

  throw new Error("Peer connection not defined.");
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
      throw Error("failed to gather ICE candidates for offer");
    }

    return ofr;
  }

  return null;
}

// Regular expression to match the playback ID at the end of the URL
// It looks for a string that follows the last "+" or "/" and continues to the end of the pathname
const playbackIdPattern = /([/+])([^/+?]+)$/;
const REPLACE_PLACEHOLDER = "PLAYBACK_ID";

let cachedRedirectUrl: URL | null = null;

async function postSDPOffer(
  endpoint: string,
  data: string,
  controller: AbortController,
  accessControl: AccessControlParams,
  sdpTimeout: number | null,
) {
  const id = setTimeout(
    () => controller.abort(),
    sdpTimeout ?? DEFAULT_TIMEOUT,
  );

  const url = new URL(endpoint);

  const parsedMatches = url.pathname.match(playbackIdPattern);

  // if we both have a cached redirect URL and a match for the playback ID,
  // use these to shortcut the typical webrtc redirect flow
  if (cachedRedirectUrl && parsedMatches?.[2]) {
    const clonedCachedUrl = new URL(cachedRedirectUrl);

    url.host = clonedCachedUrl.host;
    url.pathname = clonedCachedUrl.pathname.replace(
      REPLACE_PLACEHOLDER,
      parsedMatches[2],
    );
  }

  const response = await fetch(url.toString(), {
    method: "POST",
    mode: "cors",
    headers: {
      "content-type": "application/sdp",
      ...(accessControl?.accessKey
        ? {
            "Livepeer-Access-Key": accessControl.accessKey,
          }
        : {}),
      ...(accessControl?.jwt
        ? {
            "Livepeer-Jwt": accessControl.jwt,
          }
        : {}),
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
  timeout: number | null,
) {
  try {
    if (cachedRedirectUrl) {
      const inputUrl = new URL(endpoint);

      inputUrl.host = cachedRedirectUrl.host;

      return inputUrl;
    }

    const id = setTimeout(
      () => abortController.abort(),
      timeout ?? DEFAULT_TIMEOUT,
    );

    const response = await fetch(endpoint, {
      method: "HEAD",
      signal: abortController.signal,
    });

    clearTimeout(id);

    const parsedUrl = new URL(response.url);

    if (parsedUrl) {
      const cachedUrl = new URL(parsedUrl);
      cachedUrl.pathname = cachedUrl.pathname.replace(
        playbackIdPattern,
        `$1${REPLACE_PLACEHOLDER}`,
      );
      cachedRedirectUrl = cachedUrl;
    }

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
      if (peerConnection.iceGatheringState === "complete") {
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
