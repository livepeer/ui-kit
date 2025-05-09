import { NOT_ACCEPTABLE_ERROR_MESSAGE } from "@livepeer/core/errors";
import type { AccessControlParams } from "@livepeer/core/media";
import { isClient } from "../media/utils";

/**
 * Checks if WebRTC is supported and returns the appropriate RTCPeerConnection constructor.
 */
export const getRTCPeerConnectionConstructor = () => {
  // Check if the current environment is a client (browser)
  if (!isClient()) {
    return null; // If not a client, WebRTC is not supported
  }

  // Return the constructor for RTCPeerConnection with any vendor prefixes
  return (
    window.RTCPeerConnection ||
    window.webkitRTCPeerConnection ||
    window.mozRTCPeerConnection ||
    null // Return null if none of the constructors are available
  );
};

/**
 * Creates a new RTCPeerConnection instance with the given STUN and TURN servers.
 */
export function createPeerConnection(
  host: string | null,
  iceServers?: RTCIceServer | RTCIceServer[],
): RTCPeerConnection | null {
  const RTCPeerConnectionConstructor = getRTCPeerConnectionConstructor();

  if (!RTCPeerConnectionConstructor) {
    throw new Error("No RTCPeerConnection constructor found in this browser.");
  }

  // Defaults to Mist behavior
  const hostNoPort = host?.split(":")[0];
  const defaultIceServers = host
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

  return new RTCPeerConnectionConstructor({
    iceServers: iceServers
      ? Array.isArray(iceServers)
        ? iceServers
        : [iceServers]
      : defaultIceServers,
  });
}

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
 * Helper function to prefer H264 codec in SDP
 */
function preferCodec(sdp: string, codec: string): string {
  const lines = sdp.split("\r\n");
  const mLineIndex = lines.findIndex((line) => line.startsWith("m=video"));

  if (mLineIndex === -1) return sdp;

  const codecRegex = new RegExp(`a=rtpmap:(\\d+) ${codec}(/\\d+)+`);
  const codecLine = lines.find((line) => codecRegex.test(line));

  if (!codecLine) return sdp;

  // biome-ignore lint/style/noNonNullAssertion: todo: fix this
  const codecPayload = codecRegex.exec(codecLine)![1];
  const mLineElements = lines[mLineIndex].split(" ");

  const reorderedMLine = [
    ...mLineElements.slice(0, 3),
    codecPayload,
    ...mLineElements.slice(3).filter((payload) => payload !== codecPayload),
  ];

  lines[mLineIndex] = reorderedMLine.join(" ");
  return lines.join("\r\n");
}

/**
 * Constructs the client's SDP offer with H264 codec preference
 *
 * SDP describes what kind of media we can send and how the server and client communicate.
 *
 * https://developer.mozilla.org/en-US/docs/Glossary/SDP
 * https://www.ietf.org/archive/id/draft-ietf-wish-whip-01.html#name-protocol-operation
 */
export async function constructClientOffer(
  peerConnection: RTCPeerConnection | null | undefined,
  endpoint: string | null | undefined,
  noIceGathering?: boolean,
) {
  if (peerConnection && endpoint) {
    // Override createOffer to include H264 codec preference
    const originalCreateOffer = peerConnection.createOffer.bind(peerConnection);
    // @ts-ignore (TODO: fix this)
    peerConnection.createOffer = async function (...args) {
      // @ts-ignore (TODO: fix this)
      const originalOffer = await originalCreateOffer.apply(this, args);
      return new RTCSessionDescription({
        // @ts-ignore (TODO: fix this)
        type: originalOffer.type,
        // @ts-ignore (TODO: fix this)
        sdp: preferCodec(originalOffer.sdp, "H264"),
      });
    };

    /** https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/createOffer */
    const offer = await peerConnection.createOffer();

    /** https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/setLocalDescription */
    await peerConnection.setLocalDescription(offer);

    /** Wait for ICE gathering to complete */
    if (noIceGathering) {
      return peerConnection.localDescription;
    }
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

    // consume response body
    await response.text();

    clearTimeout(id);

    const parsedUrl = new URL(response.url);

    if (parsedUrl) {
      const cachedUrl = new URL(parsedUrl);
      cachedUrl.pathname = cachedUrl.pathname.replace(
        playbackIdPattern,
        `$1${REPLACE_PLACEHOLDER}`,
      );
      if (!cachedUrl.searchParams.has("ingestpb", "true")) {
        cachedRedirectUrl = cachedUrl;
      }
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
