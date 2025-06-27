import { PERMISSIONS_ERROR_MESSAGE } from "@livepeer/core/errors";
import type { MediaControllerStore } from "@livepeer/core/media";
import type { ClientStorage } from "@livepeer/core/storage";
import { warn } from "@livepeer/core/utils";
import {
  createJSONStorage,
  persist,
  subscribeWithSelector,
} from "zustand/middleware";
import { createStore, type StoreApi } from "zustand/vanilla";
import { isPictureInPictureSupported } from "./media/controls";
import { getRTCPeerConnectionConstructor } from "./webrtc/shared";
import {
  attachMediaStreamToPeerConnection,
  createMirroredVideoTrack,
  createNewWHIP,
  getDisplayMedia,
  getDisplayMediaExists,
  getMediaDevices,
  getUserMedia,
  // biome-ignore lint/correctness/noUnusedImports: ignored using `--suppress`
  setMediaStreamTracksStatus,
} from "./webrtc/whip";

const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export type BroadcastStatus = "live" | "pending" | "idle";
export type AudioDeviceId = "default" | `ID${string}`;
export type VideoDeviceId = "default" | "screen" | `ID${string}`;

export type MediaDeviceIds = {
  audioinput: AudioDeviceId;
  videoinput: VideoDeviceId;
};

export type MediaDeviceInfoExtended = Omit<
  MediaDeviceInfo,
  "label" | "toJSON"
> & {
  /**
   * This is a convenience field added to MediaDeviceInfo to help easily add a device picker.
   *
   * For security reasons, the label field will blank unless an active media stream exists
   * or the user has granted persistent permission for media device access. The set of device labels
   * could otherwise be used as part of a fingerprinting mechanism to identify a user.
   *
   * When the label field is not blank, these are the same value. Otherwise, the value is a friendly default.
   */
  friendlyName: string;
  /**
   * For security reasons, the label field is blank unless an active media stream exists
   * or the user has granted persistent permission for media device access. The set of device labels
   * could otherwise be used as part of a fingerprinting mechanism to identify a user.
   *
   * We override it here to be null when it is blank, for easier developer usage.
   */
  label: string | null;
};

export const getBroadcastDeviceInfo = (
  version: string,
): BroadcastDeviceInformation => ({
  version,

  isMediaDevicesSupported: Boolean(getMediaDevices()),
  isRTCPeerConnectionSupported: Boolean(getRTCPeerConnectionConstructor()),
  isDisplayMediaSupported: Boolean(getDisplayMediaExists()),
});

export type BroadcastDeviceInformation = {
  version: string;

  /** If the environment supports mediaDevices */
  isMediaDevicesSupported: boolean;
  /** If the environment supports RTCPeerConnection */
  isRTCPeerConnectionSupported: boolean;
  /** If the environment supports sharing display media */
  isDisplayMediaSupported: boolean;
};

export type BroadcastControlsState = {
  /** The last time that a force renegotiation was requested (this is triggered on an error) */
  requestedForceRenegotiateLastTime: number;
  /** The last time that the device list was requested */
  requestedUpdateDeviceListLastTime: number;

  /** The requested audio input device ID */
  requestedAudioInputDeviceId: AudioDeviceId;
  /** The requested video input device ID */
  requestedVideoInputDeviceId: VideoDeviceId | null;

  /** The previous video input device ID, used when screenshare ends */
  previousVideoInputDeviceId: VideoDeviceId | null;

  /** The original microphone track, stored for swapping with silent track */
  microphoneTrack: MediaStreamTrack | null;

  /**
   * The internal list of the current media devices from the browser.
   */
  mediaDevices: MediaDeviceInfo[] | null;
};

export type InitialBroadcastProps = {
  /**
   * The aspect ratio for the container element
   */
  aspectRatio: number | null;

  /**
   * Whether audio is initially enabled for the broadcast.
   *
   * Set to false to initialize the broadcast to not request an audio track.
   */
  audio: boolean | Omit<MediaTrackConstraints, "deviceId">;

  /**
   * The creatorId for the current broadcast.
   */
  creatorId: string | null;

  /**
   * Whether hotkeys are enabled. Defaults to `true`. Allows users to use keyboard shortcuts for broadcast control.
   *
   * This is highly recommended to adhere to ARIA guidelines.
   */
  hotkeys: boolean;

  /**
   * Whether the WebRTC stream should attempt to initialize immediately after the user grants
   * permission to their video/audio input.
   *
   * Defaults to `false`, where preview is shown and then once the stream is enabled, it sends
   * media to the server.
   */
  forceEnabled?: boolean;

  /**
   * Whether video is initially enabled for the broadcast.
   *
   * Set to false to initialize the broadcast to not request a video track.
   */
  video: boolean | Omit<MediaTrackConstraints, "deviceId">;

  /**
   * @deprecated in favor of `iceServers`
   *
   * Whether to disable ICE gathering.
   *
   * Set to true to disable ICE gathering. This is useful for testing purposes.
   */
  noIceGathering?: boolean;

  /**
   * Whether to send a silent audio track if the audio is disabled.
   *
   * Set to true to send a silent audio track if the audio is disabled.
   */
  silentAudioTrack?: boolean;

  /**
   * The ICE servers to use.
   *
   * If not provided, the default ICE servers will be used.
   */
  iceServers?: RTCIceServer | RTCIceServer[];

  /**
   * Whether the video stream should be mirrored (horizontally flipped).
   *
   * Set to true to broadcast a mirrored view.
   * Defaults to `false`.
   */
  mirrored?: boolean;
};

export type BroadcastAriaText = {
  audioTrigger: string;
  start: string;
  screenshareTrigger: string;
  videoTrigger: string;
};

export type BroadcastState = {
  /** The ARIA text for the current state. */
  aria: BroadcastAriaText;

  /** If the broadcast audio track is turned on. */
  audio: boolean;

  /** Whether the broadcast is currently enabled, or in "preview" mode. */
  enabled: boolean;

  /** Whether the broadcast store is hydrated. */
  hydrated: boolean;

  /**
   * A list of the current media devices. This will change when permissions change, or when
   * a user starts sharing their display.
   */
  mediaDevices: MediaDeviceInfoExtended[] | null;

  /** The MediaStream for the current broadcast. */
  mediaStream: MediaStream | null;

  /** Whether the broadcast component is mounted. */
  mounted: boolean;

  /** The RTCPeerConnection for the current broadcast. */
  peerConnection: RTCPeerConnection | null;

  /** The status of the current broadcast. */
  status: BroadcastStatus;

  /**
   * The WHIP ingest URL to use for the broadcast.
   */
  ingestUrl: string | null;

  /** If the broadcast video track is turned on. */
  video: boolean;

  /** The currently selected media devices. */
  mediaDeviceIds: MediaDeviceIds;

  /** The initial props passed into the component. */
  __initialProps: InitialBroadcastProps;
  /** The broadcast device information and support. */
  __device: BroadcastDeviceInformation;
  /** The controls state. */
  __controls: BroadcastControlsState;

  __controlsFunctions: {
    requestDeviceListInfo: () => void;
    requestForceRenegotiate: () => void;
    requestMediaDeviceId: (
      deviceId: AudioDeviceId,
      type: keyof MediaDeviceIds,
    ) => void;
    rotateAudioSource: () => void;
    rotateVideoSource: () => void;
    setIngestUrl: (ingestUrl: string) => void;
    setInitialState: (
      ids: MediaDeviceIds,
      audio: boolean,
      video: boolean,
    ) => void;
    setPeerConnection: (peerConnection: RTCPeerConnection) => void;
    setStatus: (status: BroadcastStatus) => void;
    setMediaDeviceIds: (mediaDevices: Partial<MediaDeviceIds>) => void;
    toggleAudio: () => void;
    toggleDisplayMedia: () => void;
    toggleEnabled: () => void;
    toggleVideo: () => void;
    updateDeviceList: (mediaDevices: MediaDeviceInfo[]) => void;
    updateMediaStream: (mediaStream: MediaStream) => void;
  };
};

export type BroadcastStore = StoreApi<BroadcastState> & {
  subscribe: {
    (
      listener: (
        selectedState: BroadcastState,
        previousSelectedState: BroadcastState,
      ) => void,
    ): () => void;
    <U>(
      selector: (state: BroadcastState) => U,
      listener: (selectedState: U, previousSelectedState: U) => void,
      options?: {
        equalityFn?: (a: U, b: U) => boolean;
        fireImmediately?: boolean;
      },
    ): () => void;
  };
  persist: {
    onFinishHydration: (fn: (state: BroadcastState) => void) => () => void;
  };
};

export const createBroadcastStore = ({
  ingestUrl,
  device,
  storage,
  initialProps,
}: {
  ingestUrl: string | null | undefined;
  device: BroadcastDeviceInformation;
  storage: ClientStorage;
  initialProps: Partial<InitialBroadcastProps>;
}): { store: BroadcastStore; destroy: () => void } => {
  const initialControls: BroadcastControlsState = {
    requestedUpdateDeviceListLastTime: 0,
    requestedForceRenegotiateLastTime: 0,
    requestedAudioInputDeviceId: "default",
    requestedVideoInputDeviceId: null,
    previousVideoInputDeviceId: null,
    mediaDevices: null,
    microphoneTrack: null,
  };

  const store = createStore<
    BroadcastState,
    [
      ["zustand/subscribeWithSelector", Partial<BroadcastState>],
      ["zustand/persist", Partial<BroadcastState>],
    ]
  >(
    subscribeWithSelector(
      persist(
        // biome-ignore lint/correctness/noUnusedFunctionParameters: ignored using `--suppress`
        (set, get) => ({
          audio: initialProps?.audio !== false,
          video: initialProps?.video !== false,

          hydrated: false,
          mounted: false,

          enabled: initialProps?.forceEnabled ?? false,

          status: "idle",

          mediaStream: null,
          mediaDevices: null,
          peerConnection: null,

          ingestUrl: ingestUrl ?? null,

          mediaDeviceIds: {
            audioinput: "default",
            videoinput: "default",
          },

          aria: {
            audioTrigger:
              initialProps?.audio === false
                ? "Turn audio on (space)"
                : "Turn audio off (space)",
            start: "Start broadcasting (b)",
            screenshareTrigger: "Share screen (d)",
            videoTrigger:
              initialProps?.video === false
                ? "Turn video on (v)"
                : "Turn video off (v)",
          },

          __initialProps: {
            aspectRatio: initialProps?.aspectRatio ?? null,
            audio: initialProps?.audio ?? true,
            creatorId: initialProps.creatorId ?? null,
            forceEnabled: initialProps?.forceEnabled ?? false,
            hotkeys: initialProps.hotkeys ?? true,
            ingestUrl: ingestUrl ?? null,
            video: initialProps?.video ?? true,
            noIceGathering: initialProps?.noIceGathering ?? false,
            silentAudioTrack: initialProps?.silentAudioTrack ?? false,
            iceServers: initialProps?.iceServers,
            mirrored: initialProps?.mirrored ?? false,
          },

          __device: device,

          __controls: initialControls,

          __metadata: null,

          __controlsFunctions: {
            updateMediaStream: (mediaStream) =>
              set(() => ({
                mediaStream,
              })),

            setPeerConnection: (peerConnection) =>
              set(() => ({
                peerConnection,
              })),

            setIngestUrl: (ingestUrl) =>
              set(() => ({
                ingestUrl,
              })),

            requestForceRenegotiate: () =>
              set(({ __controls }) => ({
                __controls: {
                  ...__controls,
                  requestedForceRenegotiateLastTime: Date.now(),
                },
              })),

            rotateAudioSource: () =>
              set(({ mediaDeviceIds, mediaDevices, __controls }) => {
                if (!mediaDevices) {
                  warn(
                    "Could not rotate audio source, no audio media devices detected.",
                  );

                  return {};
                }

                const audioDevices = mediaDevices.filter(
                  (m) => m.kind === "audioinput",
                );

                const currentAudioInputIndex = audioDevices.findIndex(
                  (s) => s.deviceId === mediaDeviceIds.audioinput,
                );

                // Get the next audio input device
                const nextAudioInputDevice =
                  audioDevices[
                    (currentAudioInputIndex + 1) % audioDevices.length
                  ] ?? null;

                return {
                  __controls: {
                    ...__controls,
                    requestedAudioInputDeviceId:
                      nextAudioInputDevice.deviceId as AudioDeviceId,
                  },
                };
              }),

            rotateVideoSource: () =>
              set(({ mediaDeviceIds, mediaDevices, __controls }) => {
                if (!mediaDevices) {
                  warn(
                    "Could not rotate video source, no video media devices detected.",
                  );

                  return {};
                }

                const videoDevices = mediaDevices.filter(
                  (m) => m.kind === "videoinput",
                );

                const currentVideoInputIndex = videoDevices.findIndex(
                  (s) => s.deviceId === mediaDeviceIds.videoinput,
                );

                // Get the next video input device
                const nextVideoInputDevice =
                  videoDevices[
                    (currentVideoInputIndex + 1) % videoDevices.length
                  ] ?? null;

                return {
                  __controls: {
                    ...__controls,
                    requestedVideoInputDeviceId:
                      nextVideoInputDevice.deviceId as VideoDeviceId,
                  },
                };
              }),

            toggleDisplayMedia: () =>
              set(({ __controls, mediaDeviceIds, aria }) => {
                if (mediaDeviceIds.videoinput === "screen") {
                  return {
                    aria: {
                      ...aria,
                      screenshareTrigger: "Share screen (d)",
                    },
                    __controls: {
                      ...__controls,
                      requestedVideoInputDeviceId:
                        __controls.previousVideoInputDeviceId,
                    },
                  };
                }

                return {
                  aria: {
                    ...aria,
                    screenshareTrigger: "Stop sharing screen (d)",
                  },
                  __controls: {
                    ...__controls,
                    previousVideoInputDeviceId: mediaDeviceIds.videoinput,
                    requestedVideoInputDeviceId: "screen",
                  },
                };
              }),

            setInitialState: (deviceIds, audio, video) =>
              set(({ __controls }) => ({
                hydrated: true,
                audio,
                video,
                __controls: {
                  ...__controls,
                  requestedAudioInputDeviceId:
                    deviceIds?.audioinput ?? "default",
                  requestedVideoInputDeviceId:
                    deviceIds?.videoinput === "screen"
                      ? "default"
                      : (deviceIds?.videoinput ?? "default"),
                },
              })),

            requestMediaDeviceId: (deviceId, type) =>
              set(({ __controls }) => ({
                __controls: {
                  ...__controls,
                  ...(type === "videoinput"
                    ? {
                        requestedVideoInputDeviceId: deviceId,
                      }
                    : type === "audioinput"
                      ? {
                          requestedAudioInputDeviceId: deviceId,
                        }
                      : {}),
                },
              })),

            setStatus: (status) =>
              set(() => ({
                status,
              })),

            setMediaDeviceIds: (newMediaDeviceIds) =>
              set(({ mediaDeviceIds }) => ({
                mediaDeviceIds: {
                  ...mediaDeviceIds,
                  ...newMediaDeviceIds,
                },
              })),

            updateDeviceList: (mediaDevices) =>
              set(({ __controls }) => ({
                __controls: {
                  ...__controls,
                  mediaDevices,
                },
              })),

            requestDeviceListInfo: () =>
              set(({ __controls }) => ({
                __controls: {
                  ...__controls,
                  requestedUpdateDeviceListLastTime: Date.now(),
                },
              })),

            toggleVideo: () =>
              set(({ video, aria }) => ({
                video: !video,
                aria: {
                  ...aria,
                  videoTrigger: !video
                    ? "Turn video off (v)"
                    : "Turn video on (v)",
                },
              })),

            toggleAudio: () =>
              set(({ audio, aria }) => ({
                audio: !audio,
                aria: {
                  ...aria,
                  audioTrigger: !audio
                    ? "Turn audio off (space)"
                    : "Turn audio on (space)",
                },
              })),

            toggleEnabled: () =>
              set(({ enabled, aria }) => ({
                enabled: !enabled,
                aria: {
                  ...aria,
                  start: enabled
                    ? "Start broadcasting (b)"
                    : "Stop broadcasting (b)",
                },
              })),
          },
        }),
        {
          name: "livepeer-broadcast-controller",
          version: 1,
          // these values are persisted across broadcasts
          partialize: ({ audio, video, mediaDeviceIds }) => ({
            audio,
            video,
            mediaDeviceIds,
          }),
          storage: createJSONStorage(() => storage),
        },
      ),
    ),
  );

  const destroy = store.persist.onFinishHydration(
    ({ mediaDeviceIds, audio, video }) => {
      store
        .getState()
        .__controlsFunctions.setInitialState(mediaDeviceIds, audio, video);
    },
  );

  return { store, destroy };
};

const MEDIA_BROADCAST_INITIALIZED_ATTRIBUTE =
  "data-livepeer-broadcast-initialized";

const allKeyTriggers = [
  "KeyL",
  "KeyV",
  "KeyB",
  "Space",
  "KeyD",
  "KeyC",
  "KeyM",
] as const;
type KeyTrigger = (typeof allKeyTriggers)[number];

export const addBroadcastEventListeners = (
  element: HTMLMediaElement,
  store: BroadcastStore,
  mediaStore: MediaControllerStore,
) => {
  const onKeyUp = (e: KeyboardEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const code = e.code as KeyTrigger;

    if (allKeyTriggers.includes(code)) {
      if (code === "Space" || code === "KeyL") {
        store.getState().__controlsFunctions.toggleAudio();
      } else if (code === "KeyV") {
        store.getState().__controlsFunctions.toggleVideo();
      } else if (code === "KeyB") {
        store.getState().__controlsFunctions.toggleEnabled();
      } else if (code === "KeyD") {
        store.getState().__controlsFunctions.toggleDisplayMedia();
      } else if (code === "KeyC") {
        store.getState().__controlsFunctions.rotateVideoSource();
      } else if (code === "KeyM") {
        store.getState().__controlsFunctions.rotateAudioSource();
      }
    }
  };

  const onDeviceChange = () => {
    store.getState().__controlsFunctions.requestDeviceListInfo();
  };

  const mediaDevices = getMediaDevices();

  mediaDevices?.addEventListener?.("devicechange", onDeviceChange);

  const parentElementOrElement = element?.parentElement ?? element;

  if (element) {
    if (parentElementOrElement) {
      if (store.getState().__initialProps.hotkeys) {
        parentElementOrElement.addEventListener("keyup", onKeyUp);
        parentElementOrElement.setAttribute("tabindex", "0");
      }
    }

    element.setAttribute(MEDIA_BROADCAST_INITIALIZED_ATTRIBUTE, "true");
  }

  // add effects
  const { destroy: destroyEffects } = addEffectsToStore(
    element,
    store,
    mediaStore,
  );

  const removeHydrationListener = store.persist.onFinishHydration(
    ({ mediaDeviceIds, audio, video }) => {
      store
        .getState()
        .__controlsFunctions.setInitialState(mediaDeviceIds, audio, video);
    },
  );

  return {
    destroy: () => {
      removeHydrationListener?.();

      parentElementOrElement?.removeEventListener?.("keyup", onKeyUp);

      mediaDevices?.removeEventListener?.("devicechange", onDeviceChange);

      destroyEffects?.();

      element?.removeAttribute?.(MEDIA_BROADCAST_INITIALIZED_ATTRIBUTE);
    },
  };
};

type Cleanup = () => void | Promise<void>;

// Cleanup function for whip
let cleanupWhip: Cleanup = () => {};
// Cleanup function for media source
let cleanupMediaStream: Cleanup = () => {};

const addEffectsToStore = (
  element: HTMLMediaElement,
  store: BroadcastStore,
  mediaStore: MediaControllerStore,
) => {
  /** MEDIA STORE SYNC LISTENERS - these one-way synchronize the playback state with the broadcast state */

  // Subscribe to error count
  const destroyErrorCount = mediaStore.subscribe(
    ({ errorCount }) => errorCount,
    async (errorCount) => {
      if (errorCount > 0) {
        const delayTime = 500 * 2 ** (errorCount - 1);
        await delay(delayTime);

        store.getState().__controlsFunctions.requestForceRenegotiate();
      }
    },
  );

  // Subscribe to sync the mounted states
  const destroyMediaSyncMounted = mediaStore.subscribe(
    ({ mounted }) => mounted,
    async (mounted) => {
      // we use setState here so it's clear this isn't an external function
      store.setState({ mounted });
    },
  );

  // Subscribe to sync the error states
  const destroyMediaSyncError = mediaStore.subscribe(
    ({ error }) => error,
    async (error) => {
      if (error?.type === "permissions") {
        // we use setState here so it's clear this isn't an external function
        store.setState((state) => ({
          __controls: {
            ...state.__controls,
            requestedVideoInputDeviceId: state.mediaDeviceIds.videoinput,
          },
        }));
      }
    },
  );

  // Subscribe to media stream changes
  const destroyPictureInPictureSupportedMonitor = store.subscribe(
    (state) => state.mediaStream,
    async () => {
      const isPipSupported = isPictureInPictureSupported(element);

      if (!isPipSupported) {
        mediaStore.setState((state) => ({
          __device: {
            ...state.__device,
            isPictureInPictureSupported: isPipSupported,
          },
        }));
      }
    },
    {
      equalityFn: (a, b) => a?.id === b?.id,
    },
  );

  /** STORE LISTENERS - handle broadcast state */

  // Subscribe to request user media
  const destroyWhip = store.subscribe(
    ({ enabled, ingestUrl, __controls, mounted, __initialProps }) => ({
      enabled,
      ingestUrl,
      requestedForceRenegotiateLastTime:
        __controls.requestedForceRenegotiateLastTime,
      mounted,
      noIceGathering: __initialProps.noIceGathering,
      silentAudioTrack: __initialProps.silentAudioTrack,
      iceServers: __initialProps.iceServers,
    }),
    async ({ enabled, ingestUrl, noIceGathering, iceServers }) => {
      await cleanupWhip?.();

      if (!enabled) {
        return;
      }

      if (!ingestUrl) {
        warn(
          "No ingest URL provided, cannot start stream. Please check the configuration passed to the Broadcast component.",
        );
        return;
      }

      let unmounted = false;

      const onErrorComposed = (err: Error) => {
        if (!unmounted) {
          mediaStore.getState().__controlsFunctions.setLive(false);
          mediaStore.getState().__controlsFunctions?.onError?.(err);
        }
      };

      store.getState().__controlsFunctions.setStatus("pending");

      const { destroy } = createNewWHIP({
        ingestUrl,
        element,
        callbacks: {
          onRTCPeerConnection: (peerConnection) => {
            store
              .getState()
              .__controlsFunctions.setPeerConnection(peerConnection);
          },
          onConnected: () => {
            store.getState().__controlsFunctions.setStatus("live");
            mediaStore.getState().__controlsFunctions.onError(null);
          },
          onError: onErrorComposed,
        },
        sdpTimeout: null,
        noIceGathering,
        iceServers,
      });

      cleanupWhip = () => {
        unmounted = true;
        destroy?.();
        store.getState().__controlsFunctions.setStatus("idle");
      };
    },
    {
      equalityFn: (a, b) =>
        a.requestedForceRenegotiateLastTime ===
          b.requestedForceRenegotiateLastTime &&
        a.ingestUrl === b.ingestUrl &&
        a.enabled === b.enabled &&
        a.mounted === b.mounted,
    },
  );

  // Subscribe to request user media
  const destroyRequestUserMedia = store.subscribe(
    (state) => ({
      hydrated: state.hydrated,
      mounted: state.mounted,
      video: state.video,
      audio: state.audio,
      requestedAudioDeviceId: state.__controls.requestedAudioInputDeviceId,
      requestedVideoDeviceId: state.__controls.requestedVideoInputDeviceId,
      initialAudioConfig: state.__initialProps.audio,
      initialVideoConfig: state.__initialProps.video,
      mirrored: state.__initialProps.mirrored,
      previousMediaStream: state.mediaStream,
      silentAudioTrack: state.__initialProps.silentAudioTrack,
    }),
    async ({
      hydrated,
      mounted,
      audio,
      video,
      requestedAudioDeviceId,
      requestedVideoDeviceId,
      previousMediaStream,
      initialAudioConfig,
      initialVideoConfig,
      silentAudioTrack,
      mirrored,
    }) => {
      try {
        if (!mounted || !hydrated) {
          return;
        }

        // Force audio to true if silentAudioTrack is enabled so we get a microphone track
        const shouldRequestAudio = audio || silentAudioTrack;

        if (!shouldRequestAudio && !video) {
          console.log(
            "|||| FORCING VIDEO ENABLED to request getUserMedia ||||",
          );
          warn(
            "At least one of audio and video must be requested. Overriding video to be enabled so that `getUserMedia` can be requested.",
          );

          store.setState({ video: true });
          video = true;
        }

        const audioConstraints =
          typeof initialAudioConfig !== "boolean" ? initialAudioConfig : null;
        const videoConstraints =
          typeof initialVideoConfig !== "boolean" ? initialVideoConfig : null;

        console.log(
          "|||| Requesting media with audio:",
          shouldRequestAudio,
          "and video:",
          video,
          "||||",
        );
        const stream = await (requestedVideoDeviceId === "screen"
          ? getDisplayMedia({
              // for now, only the microphone audio track is supported - we don't support multiple
              // discrete audio tracks
              audio: false,

              // we assume that if the user is requested to share screen, they want to enable video,
              // and we don't listen to the `video` enabled state
              //
              // we apply the video constraints to the video track
              video: videoConstraints ?? true,
            })
          : getUserMedia({
              // Always request audio if silentAudioTrack is enabled
              audio:
                shouldRequestAudio &&
                requestedAudioDeviceId &&
                requestedAudioDeviceId !== "default"
                  ? {
                      ...(audioConstraints ? audioConstraints : {}),
                      deviceId: {
                        ideal: requestedAudioDeviceId,
                      },
                    }
                  : shouldRequestAudio
                    ? {
                        ...(audioConstraints ? audioConstraints : {}),
                      }
                    : false,
              video:
                video &&
                requestedVideoDeviceId &&
                requestedVideoDeviceId !== "default"
                  ? {
                      ...(videoConstraints ? videoConstraints : {}),
                      deviceId: {
                        ideal: requestedVideoDeviceId,
                      },
                      ...(mirrored ? { facingMode: "user" } : {}),
                    }
                  : video
                    ? {
                        ...(videoConstraints ? videoConstraints : {}),
                        ...(mirrored ? { facingMode: "user" } : {}),
                      }
                    : false,
            }));

        if (stream) {
          const microphoneTrack = stream?.getAudioTracks()?.[0] ?? null;
          if (microphoneTrack) {
            store.setState((state) => ({
              __controls: {
                ...state.__controls,
                microphoneTrack: microphoneTrack,
              },
            }));
          }

          // we get the device ID from the MediaStream and update those
          const allAudioTracks = stream?.getAudioTracks() ?? [];
          const allVideoTracks = stream?.getVideoTracks() ?? [];

          const allAudioDeviceIds = allAudioTracks.map(
            (track) => track?.getSettings()?.deviceId,
          );
          const allVideoDeviceIds = allVideoTracks.map(
            (track) => track?.getSettings()?.deviceId,
          );

          const firstAudioDeviceId = (allAudioDeviceIds?.[0] ??
            null) as AudioDeviceId | null;
          const firstVideoDeviceId = (allVideoDeviceIds?.[0] ??
            null) as VideoDeviceId | null;

          store.getState().__controlsFunctions.setMediaDeviceIds({
            ...(firstAudioDeviceId ? { audioinput: firstAudioDeviceId } : {}),
            ...(firstVideoDeviceId
              ? {
                  videoinput:
                    requestedVideoDeviceId === "screen"
                      ? "screen"
                      : firstVideoDeviceId,
                }
              : {}),
          });

          // merge the new audio and/or video and the old media stream
          const mergedMediaStream = new MediaStream();

          const mergedAudioTrack =
            allAudioTracks?.[0] ??
            previousMediaStream?.getAudioTracks?.()?.[0] ??
            null;

          let mergedVideoTrack =
            allVideoTracks?.[0] ??
            previousMediaStream?.getVideoTracks?.()?.[0] ??
            null;

          if (
            mergedVideoTrack &&
            mirrored &&
            requestedVideoDeviceId !== "screen"
          ) {
            try {
              const videoSettings = mergedVideoTrack.getSettings();
              const isFrontFacing =
                videoSettings.facingMode === "user" ||
                !videoSettings.facingMode;

              if (isFrontFacing) {
                element.classList.add("livepeer-mirrored-video");
                mergedVideoTrack = createMirroredVideoTrack(mergedVideoTrack);
              } else {
                element.classList.remove("livepeer-mirrored-video");
              }
            } catch (err) {
              warn(
                `Failed to apply video mirroring: ${(err as Error).message}`,
              );
            }
          } else {
            element.classList.remove("livepeer-mirrored-video");
          }

          if (mergedAudioTrack) mergedMediaStream.addTrack(mergedAudioTrack);
          if (mergedVideoTrack) mergedMediaStream.addTrack(mergedVideoTrack);

          store
            .getState()
            .__controlsFunctions.updateMediaStream(mergedMediaStream);
        }
      } catch (e) {
        if ((e as Error)?.name === "NotAllowedError") {
          mediaStore
            .getState()
            .__controlsFunctions.onError(new Error(PERMISSIONS_ERROR_MESSAGE));
        } else {
          warn((e as Error)?.message);
        }
      }
    },
    {
      equalityFn: (a, b) =>
        a.hydrated === b.hydrated &&
        a.mounted === b.mounted &&
        a.requestedAudioDeviceId === b.requestedAudioDeviceId &&
        a.requestedVideoDeviceId === b.requestedVideoDeviceId,
    },
  );

  // Subscribe to audio & video enabled, and media stream
  const destroyAudioVideoEnabled = store.subscribe(
    (state) => ({
      audio: state.audio,
      video: state.video,
      mediaStream: state.mediaStream,
      silentAudioTrack: state.__initialProps.silentAudioTrack,
      peerConnection: state.peerConnection,
      microphoneTrack: state.__controls.microphoneTrack,
    }),
    async ({
      audio,
      video,
      mediaStream,
      silentAudioTrack,
      peerConnection,
      microphoneTrack,
    }) => {
      if (!mediaStream) return;

      for (const videoTrack of mediaStream.getVideoTracks()) {
        videoTrack.enabled = video;
      }

      if (silentAudioTrack) {
        if (peerConnection) {
          const currentAudioTrack = mediaStream.getAudioTracks()[0];

          if (!audio && microphoneTrack) {
            // use silent track
            if (currentAudioTrack && currentAudioTrack !== microphoneTrack) {
              currentAudioTrack.enabled = true;
            } else {
              // swap in a silent track
              const silentTrack = createSilentAudioTrack();

              if (currentAudioTrack) {
                mediaStream.removeTrack(currentAudioTrack);
              }
              mediaStream.addTrack(silentTrack);

              // Replace in peer connection
              const audioSender = peerConnection
                .getSenders()
                .find((s) => s.track && s.track.kind === "audio");
              if (audioSender) {
                await audioSender.replaceTrack(silentTrack);
              }
            }
          } else if (audio && microphoneTrack) {
            if (currentAudioTrack === microphoneTrack) {
              microphoneTrack.enabled = true;
            } else {
              // swap back to microphone track
              if (currentAudioTrack) {
                mediaStream.removeTrack(currentAudioTrack);
              }
              mediaStream.addTrack(microphoneTrack);

              const audioSender = peerConnection
                .getSenders()
                .find((s) => s.track && s.track.kind === "audio");
              if (audioSender) {
                await audioSender.replaceTrack(microphoneTrack);
                microphoneTrack.enabled = true;
              }
            }
          }
        } else {
          for (const audioTrack of mediaStream.getAudioTracks()) {
            audioTrack.enabled = audio;
          }
        }
      } else {
        for (const audioTrack of mediaStream.getAudioTracks()) {
          audioTrack.enabled = audio;
        }
      }
    },
    {
      equalityFn: (a, b) =>
        a.audio === b.audio &&
        a.video === b.video &&
        a.mediaStream?.id === b.mediaStream?.id,
    },
  );

  // Subscribe to media stream
  const destroyPeerConnectionAndMediaStream = store.subscribe(
    ({ mediaStream, peerConnection }) => ({ mediaStream, peerConnection }),
    async ({ mediaStream, peerConnection }) => {
      if (!mediaStream || !peerConnection) {
        return;
      }

      await attachMediaStreamToPeerConnection({
        mediaStream,
        peerConnection,
      });
    },
    {
      equalityFn: (a, b) =>
        a.mediaStream?.id === b.mediaStream?.id &&
        a.peerConnection === b.peerConnection,
    },
  );

  // Subscribe to mediastream changes
  const destroyMediaStream = store.subscribe(
    (state) => state.mediaStream,
    async (mediaStream) => {
      await cleanupMediaStream?.();

      if (mediaStream) {
        element.srcObject = mediaStream;

        const togglePlay = () => {
          mediaStore.getState().__controlsFunctions.togglePlay(true);
        };

        element.addEventListener("loadedmetadata", togglePlay);

        cleanupMediaStream = () => {
          element?.removeEventListener?.("loadedmetadata", togglePlay);

          element.srcObject = null;
        };
      } else {
        element.srcObject = null;
      }
    },
    {
      equalityFn: (a, b) => a?.id === b?.id,
    },
  );

  // Subscribe to media devices
  const destroyUpdateDeviceList = store.subscribe(
    (state) => ({
      mounted: state.mounted,
      requestedUpdateDeviceListLastTime:
        state.__controls.requestedUpdateDeviceListLastTime,
    }),
    async ({ mounted }) => {
      if (!mounted) {
        return;
      }

      const mediaDevices = getMediaDevices();
      const devices = await mediaDevices?.enumerateDevices();

      if (devices) {
        store
          .getState()
          .__controlsFunctions.updateDeviceList(
            devices.filter((d) => d.deviceId),
          );
      }
    },
    {
      equalityFn: (a, b) =>
        a.mounted === b.mounted &&
        a.requestedUpdateDeviceListLastTime ===
          b.requestedUpdateDeviceListLastTime,
    },
  );

  // Subscribe to media devices and map to friendly names
  const destroyMapDeviceListToFriendly = store.subscribe(
    (state) => ({
      mediaDeviceIds: state.mediaDeviceIds,
      mediaDevices: state.__controls.mediaDevices,
    }),
    async ({ mediaDeviceIds, mediaDevices }) => {
      if (mediaDevices) {
        const extendedDevices: MediaDeviceInfoExtended[] = mediaDevices
          .filter((d) => d.deviceId)
          .map((device, i) => ({
            deviceId: device.deviceId,
            kind: device.kind,
            groupId: device.groupId,
            label: device.label || null,
            friendlyName:
              device.label ??
              `${
                device.kind === "audioinput"
                  ? "Audio Source"
                  : device.kind === "audiooutput"
                    ? "Audio Output"
                    : "Video Source"
              } ${i + 1} (${
                device.deviceId === "default"
                  ? "default"
                  : device.deviceId.slice(0, 6)
              })`,
          }));

        const isScreenshare = mediaDeviceIds.videoinput === "screen";

        if (isScreenshare) {
          extendedDevices.push({
            deviceId: mediaDeviceIds.videoinput,
            label: "Screen share",
            groupId: "none",
            kind: "videoinput",
            friendlyName: "Screen share",
          });
        }

        store.setState({
          mediaDevices: extendedDevices,
        });
      }
    },
    {
      equalityFn: (a, b) =>
        a.mediaDeviceIds === b.mediaDeviceIds &&
        a.mediaDevices === b.mediaDevices,
    },
  );

  const destroyPeerConnectionAudioHandler = store.subscribe(
    (state) => ({
      peerConnection: state.peerConnection,
      audio: state.audio,
      mediaStream: state.mediaStream,
      silentAudioTrack: state.__initialProps.silentAudioTrack,
      microphoneTrack: state.__controls.microphoneTrack,
    }),
    async ({
      peerConnection,
      audio,
      mediaStream,
      silentAudioTrack,
      microphoneTrack,
    }) => {
      // Only run when the peer connection becomes available
      if (!peerConnection || !mediaStream || !silentAudioTrack) return;

      // swap in the silent track
      if (!audio && microphoneTrack) {
        const currentAudioTracks = mediaStream.getAudioTracks();
        const currentAudioTrack = currentAudioTracks[0];

        if (currentAudioTrack && currentAudioTrack !== microphoneTrack) {
          return;
        }

        const silentTrack = createSilentAudioTrack();

        for (const track of currentAudioTracks) {
          mediaStream.removeTrack(track);
        }

        mediaStream.addTrack(silentTrack);

        const audioSender = peerConnection
          .getSenders()
          .find((s) => s.track && s.track.kind === "audio");

        if (audioSender) {
          await audioSender.replaceTrack(silentTrack);
        }
      }
    },
    {
      equalityFn: (a, b) =>
        a.peerConnection === b.peerConnection && a.audio === b.audio,
    },
  );

  return {
    destroy: () => {
      destroyAudioVideoEnabled?.();
      destroyErrorCount?.();
      destroyMapDeviceListToFriendly?.();
      destroyMediaStream?.();
      destroyMediaSyncError?.();
      destroyMediaSyncMounted?.();
      destroyPeerConnectionAndMediaStream?.();
      destroyPeerConnectionAudioHandler?.();
      destroyPictureInPictureSupportedMonitor?.();
      destroyRequestUserMedia?.();
      destroyUpdateDeviceList?.();
      destroyWhip?.();
    },
  };
};

/**
 * Creates a silent audio track to use when audio is muted but we still want
 * to send an audio track. This helps maintain connection stability while muted.
 * @returns MediaStreamTrack A silent audio track
 */
export const createSilentAudioTrack = (): MediaStreamTrack => {
  // biome-ignore lint/suspicious/noExplicitAny: ignored using `--suppress`
  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = ctx.createOscillator();
  const dst = ctx.createMediaStreamDestination();

  const gainNode = ctx.createGain();
  gainNode.gain.value = 0;

  oscillator.type = "sine";
  oscillator.frequency.value = 440;

  oscillator.connect(gainNode);
  gainNode.connect(dst);

  oscillator.start();
  const track = dst.stream.getAudioTracks()[0];
  track.enabled = true;
  return track;
};
