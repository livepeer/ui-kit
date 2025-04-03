import { warn } from "@livepeer/core/utils";
import {
  constructClientOffer,
  createPeerConnection,
  getRedirectUrl,
  negotiateConnectionWithClientOffer,
} from "./shared";

const STANDARD_FPS = 30;

export const VIDEO_WEBRTC_INITIALIZED_ATTRIBUTE =
  "data-livepeer-video-whip-initialized";

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
export const createNewWHIP = <TElement extends HTMLMediaElement>({
  ingestUrl,
  element,
  callbacks,
  sdpTimeout,
  noIceGathering,
  iceServers,
}: {
  ingestUrl: string;
  element: TElement;
  callbacks: {
    onRTCPeerConnection?: (payload: RTCPeerConnection) => void;
    onConnected?: () => void;
    onError?: (data: Error) => void;
  };
  sdpTimeout: number | null;
  noIceGathering?: boolean;
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

  getRedirectUrl(ingestUrl, abortController, sdpTimeout)
    .then((redirectUrl) => {
      if (destroyed || !redirectUrl) {
        return;
      }

      const redirectUrlString = redirectUrl.toString().replace("video+", "");

      /**
       * Create a new WebRTC connection, using public STUN servers with ICE,
       * allowing the client to discover its own IP address.
       * https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Protocols#ice
       */
      peerConnection = createPeerConnection(redirectUrl.host, iceServers);

      if (peerConnection) {
        peerConnection.addEventListener("negotiationneeded", async (_ev) => {
          try {
            const ofr = await constructClientOffer(
              peerConnection,
              redirectUrlString,
              noIceGathering,
            );

            await negotiateConnectionWithClientOffer(
              peerConnection,
              ingestUrl,
              ofr,
              abortController,
              {},
              sdpTimeout,
            );
          } catch (e) {
            callbacks?.onError?.(e as Error);
          }
        });

        peerConnection.addEventListener(
          "connectionstatechange",
          async (_ev) => {
            try {
              if (peerConnection?.connectionState === "failed") {
                callbacks?.onError?.(new Error("Failed to connect to peer."));
              }

              if (peerConnection?.connectionState === "connected") {
                callbacks?.onConnected?.();
              }
            } catch (e) {
              callbacks?.onError?.(e as Error);
            }
          },
        );

        callbacks?.onRTCPeerConnection?.(peerConnection);
      } else {
        warn("Could not create peer connection.");
      }
    })
    .catch((e) => callbacks?.onError?.(e as Error));

  return {
    destroy: () => {
      destroyed = true;

      abortController?.abort?.();

      peerConnection?.close?.();

      element?.removeAttribute?.(VIDEO_WEBRTC_INITIALIZED_ATTRIBUTE);
    },
  };
};

export const attachMediaStreamToPeerConnection = async ({
  mediaStream,
  peerConnection,
}: {
  mediaStream: MediaStream;
  peerConnection: RTCPeerConnection;
}) => {
  const newVideoTrack = mediaStream?.getVideoTracks?.()?.[0] ?? null;
  const newAudioTrack = mediaStream?.getAudioTracks?.()?.[0] ?? null;

  const transceivers = peerConnection.getTransceivers();

  let videoTransceiver = transceivers.find(
    (t) => t.receiver.track.kind === "video",
  );
  let audioTransceiver = transceivers.find(
    (t) => t.receiver.track.kind === "audio",
  );

  if (newVideoTrack) {
    if (videoTransceiver) {
      // Replace existing video track
      await videoTransceiver.sender.replaceTrack(newVideoTrack);
    } else {
      // Add new video transceiver
      videoTransceiver = await peerConnection.addTransceiver(newVideoTrack, {
        direction: "sendonly",
      });
    }
  }

  if (newAudioTrack) {
    if (audioTransceiver) {
      // Replace existing audio track
      await audioTransceiver.sender.replaceTrack(newAudioTrack);
    } else {
      // Add new audio transceiver
      audioTransceiver = await peerConnection.addTransceiver(newAudioTrack, {
        direction: "sendonly",
      });
    }
  }
};

export const setMediaStreamTracksStatus = async ({
  enableVideo,
  enableAudio,
  mediaStream,
}: {
  enableVideo: boolean;
  enableAudio: boolean;
  mediaStream: MediaStream;
}) => {
  for (const videoTrack of mediaStream.getVideoTracks()) {
    videoTrack.enabled = enableVideo;
  }
  for (const audioTrack of mediaStream.getAudioTracks()) {
    audioTrack.enabled = enableAudio;
  }
};

export const getUserMedia = (constraints?: MediaStreamConstraints) => {
  if (typeof navigator === "undefined") {
    return null;
  }

  if (navigator?.mediaDevices?.getUserMedia) {
    // Modern browsers
    return navigator.mediaDevices.getUserMedia(constraints);
  }
  if (navigator?.getUserMedia) {
    // Older standard
    return navigator.getUserMedia(constraints);
  }
  if (navigator?.webkitGetUserMedia) {
    // Webkit browsers
    return navigator.webkitGetUserMedia(constraints);
  }
  if (navigator?.mozGetUserMedia) {
    // Mozilla browsers
    return navigator.mozGetUserMedia(constraints);
  }
  if (navigator?.msGetUserMedia) {
    // IE browsers
    return navigator.msGetUserMedia(constraints);
  }

  warn(
    "getUserMedia is not supported in this environment. Check if you are in a secure (HTTPS) context - https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia",
  );

  return null;
};

export const getMediaDevices = () => {
  if (typeof navigator === "undefined") {
    return null;
  }

  if (!navigator.mediaDevices) {
    warn(
      "mediaDevices was not found in this environment. Check if you are in a secure (HTTPS) context - https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia",
    );
    return null;
  }

  return navigator.mediaDevices;
};

export const getDisplayMediaExists = () => {
  if (typeof navigator === "undefined") {
    return false;
  }

  if (!navigator?.mediaDevices?.getDisplayMedia) {
    return false;
  }

  return true;
};

export const getDisplayMedia = (options?: DisplayMediaStreamOptions) => {
  if (typeof navigator === "undefined") {
    warn("getDisplayMedia does not exist in this environment.");

    return null;
  }

  if (!navigator?.mediaDevices?.getDisplayMedia) {
    warn("getDisplayMedia does not exist in this environment.");

    return null;
  }

  return navigator.mediaDevices.getDisplayMedia(options);
};

/**
 * Creates a mirrored version of a video track using a canvas element.
 * This function ensures the stream sent to the server is mirrored horizontally.
 */
export const createMirroredVideoTrack = (
  originalTrack: MediaStreamTrack,
): MediaStreamTrack => {
  if (originalTrack.kind !== "video") {
    warn("Cannot mirror non-video track");
    return originalTrack;
  }

  try {
    const canvas = document.createElement("canvas");
    canvas.style.position = "absolute";
    canvas.style.top = "-9999px";
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      warn("Could not get canvas context for mirroring video");
      return originalTrack;
    }

    const video = document.createElement("video");
    video.srcObject = new MediaStream([originalTrack]);
    video.autoplay = true;
    video.muted = true;
    video.playsInline = true;

    const settings = originalTrack.getSettings();
    if (settings.width && settings.height) {
      canvas.width = settings.width;
      canvas.height = settings.height;
    }

    const mirroredStream = canvas.captureStream(STANDARD_FPS);
    const mirroredTrack = mirroredStream.getVideoTracks()[0];

    let animationFrameId: number;

    const drawFrame = () => {
      if (video.readyState >= 2) {
        if (
          canvas.width !== video.videoWidth ||
          canvas.height !== video.videoHeight
        ) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(drawFrame);
    };

    video.onloadedmetadata = () => {
      if (!canvas.width || !canvas.height) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }

      video.play().catch((e) => {
        warn(`Failed to play video in mirroring process: ${e.message}`);
      });

      drawFrame();
    };

    originalTrack.addEventListener("ended", () => {
      cancelAnimationFrame(animationFrameId);
      mirroredTrack.stop();
      video.pause();
      video.srcObject = null;
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    });

    return mirroredTrack;
  } catch (err) {
    warn(`Error creating mirrored track: ${(err as Error).message}`);
    return originalTrack;
  }
};
