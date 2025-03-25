import type { AccessControlParams } from "@livepeer/core/media";

import {
  constructClientOffer,
  createPeerConnection,
  getRedirectUrl,
  negotiateConnectionWithClientOffer,
} from "./shared";

export const VIDEO_WEBRTC_INITIALIZED_ATTRIBUTE =
  "data-livepeer-video-whep-initialized";

/**
 * Client that uses WHEP to play back video over WebRTC.
 *
 * https://www.ietf.org/id/draft-murillo-whep-00.html
 */
export const createNewWHEP = <TElement extends HTMLMediaElement>({
  source,
  element,
  callbacks,
  accessControl,
  sdpTimeout,
  iceServers,
}: {
  source: string;
  element: TElement;
  callbacks: {
    onConnected?: () => void;
    onPlaybackOffsetUpdated?: (d: number) => void;
    onError?: (data: Error) => void;
    onRedirect?: (url: string | null) => void;
  };
  accessControl: AccessControlParams;
  sdpTimeout: number | null;
  iceServers?: RTCIceServer | RTCIceServer[];
}): {
  destroy: () => void;
} => {
  // do not attach twice
  if (element.getAttribute(VIDEO_WEBRTC_INITIALIZED_ATTRIBUTE) === "true") {
    return {
      destroy: () => {
        //
      },
    };
  }

  element.setAttribute(VIDEO_WEBRTC_INITIALIZED_ATTRIBUTE, "true");

  let destroyed = false;

  const abortController = new AbortController();

  let peerConnection: RTCPeerConnection | null = null;
  const stream = new MediaStream();

  const errorComposed = (e: Error) => {
    callbacks?.onError?.(e as Error);

    if (element) {
      element.srcObject = null;
    }
  };

  getRedirectUrl(source, abortController, sdpTimeout)
    .then((redirectUrl) => {
      if (destroyed || !redirectUrl) {
        return;
      }

      const redirectUrlString = redirectUrl.toString();

      callbacks?.onRedirect?.(redirectUrlString ?? null);

      /**
       * Create a new WebRTC connection, using public STUN servers with ICE,
       * allowing the client to discover its own IP address.
       * https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Protocols#ice
       */
      peerConnection = createPeerConnection(redirectUrl.host, iceServers);

      if (peerConnection) {
        /** https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/addTransceiver */
        peerConnection.addTransceiver("video", {
          direction: "recvonly",
        });
        peerConnection.addTransceiver("audio", {
          direction: "recvonly",
        });

        /**
         * When new tracks are received in the connection, store local references,
         * so that they can be added to a MediaStream, and to the <video> element.
         *
         * https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/track_event
         */
        peerConnection.ontrack = (event) => {
          if (destroyed) {
            return;
          }

          try {
            if (stream) {
              const track = event.track;
              const currentTracks = stream.getTracks();
              const streamAlreadyHasVideoTrack = currentTracks.some(
                (track) => track.kind === "video",
              );
              const streamAlreadyHasAudioTrack = currentTracks.some(
                (track) => track.kind === "audio",
              );
              switch (track.kind) {
                case "video":
                  if (streamAlreadyHasVideoTrack) {
                    break;
                  }
                  stream.addTrack(track);
                  break;
                case "audio":
                  if (streamAlreadyHasAudioTrack) {
                    break;
                  }
                  stream.addTrack(track);
                  break;
                default:
                  console.log(`received unknown track ${track}`);
              }
            }
          } catch (e) {
            errorComposed(e as Error);
          }
        };

        peerConnection.addEventListener("connectionstatechange", (_ev) => {
          if (destroyed) {
            return;
          }

          try {
            if (peerConnection?.connectionState === "failed") {
              callbacks?.onError?.(new Error("Failed to connect to peer."));
            }

            if (
              peerConnection?.connectionState === "connected" &&
              !element.srcObject
            ) {
              element.srcObject = stream;
              callbacks?.onConnected?.();
            }
          } catch (e) {
            errorComposed(e as Error);
          }
        });

        peerConnection.addEventListener("negotiationneeded", async (_ev) => {
          if (destroyed) {
            return;
          }

          try {
            const ofr = await constructClientOffer(
              peerConnection,
              redirectUrlString,
            );

            if (destroyed) {
              return;
            }

            const response = await negotiateConnectionWithClientOffer(
              peerConnection,
              source,
              ofr,
              abortController,
              accessControl,
              sdpTimeout,
            );

            if (destroyed) {
              return;
            }

            const currentDate = Date.now();

            if (response && currentDate) {
              callbacks?.onPlaybackOffsetUpdated?.(
                currentDate - response.getTime(),
              );
            }
          } catch (e) {
            errorComposed(e as Error);
          }
        });
      }
    })
    .catch((e) => errorComposed(e as Error));

  return {
    destroy: () => {
      destroyed = true;
      abortController?.abort?.();

      peerConnection?.close?.();

      // Remove the WebRTC source
      if (element) {
        element.srcObject = null;
      }

      element?.removeAttribute?.(VIDEO_WEBRTC_INITIALIZED_ATTRIBUTE);
    },
  };
};
