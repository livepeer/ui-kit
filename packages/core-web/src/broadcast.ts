import { MediaControllerStore } from "@livepeer/core/media";
import { ClientStorage } from "@livepeer/core/storage";
import {
  createJSONStorage,
  persist,
  subscribeWithSelector,
} from "zustand/middleware";
import { StoreApi, createStore } from "zustand/vanilla";

import { PERMISSIONS_ERROR_MESSAGE } from "@livepeer/core/errors";
import { warn } from "@livepeer/core/utils";
import { isPictureInPictureSupported } from "./media/controls";
import { getRTCPeerConnectionConstructor } from "./webrtc/shared";
import {
  attachMediaStreamToPeerConnection,
  createNewWHIP,
  getDisplayMedia,
  getDisplayMediaExists,
  getMediaDevices,
  getUserMedia,
  setMediaStreamTracksStatus,
} from "./webrtc/whip";

const defaultIngestUrl = "https://playback.livepeer.studio/webrtc";

const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

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
  audio: boolean;

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
   * The ingest URL for the WHIP WebRTC broadcast.
   *
   * Defaults to Livepeer Studio (`https://playback.livepeer.studio/webrtc`).
   */
  ingestUrl: string;

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
  video: boolean;
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

  /**
   * The stream key to use for the broadcast.
   */
  streamKey: string | null;

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
    setInitialState: (
      ids: MediaDeviceIds,
      audio: boolean,
      video: boolean,
    ) => void;
    setPeerConnection: (peerConnection: RTCPeerConnection) => void;
    setMediaDeviceIds: (mediaDevices: Partial<MediaDeviceIds>) => void;
    setStreamKey: (streamKey: string) => void;
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
  streamKey,
  device,
  storage,
  initialProps,
}: {
  streamKey: string;
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
        (set, get) => ({
          audio: initialProps?.audio !== false,
          video: initialProps?.video !== false,

          hydrated: false,
          mounted: false,

          enabled: initialProps?.forceEnabled ?? false,

          mediaStream: null,
          mediaDevices: null,
          peerConnection: null,

          streamKey: streamKey ?? null,

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
            audio: initialProps?.video ?? true,
            creatorId: initialProps.creatorId ?? null,
            forceEnabled: initialProps?.forceEnabled ?? false,
            hotkeys: initialProps.hotkeys ?? true,
            ingestUrl: initialProps?.ingestUrl ?? defaultIngestUrl,
            video: initialProps?.video ?? true,
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

            setStreamKey: (streamKey) =>
              set(() => ({
                streamKey,
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
                      : deviceIds?.videoinput ?? "default",
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
  const removeEffectsFromStore = addEffectsToStore(element, store, mediaStore);

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

      removeEffectsFromStore?.();

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
      if (mounted) {
        // we use setState here so it's clear this isn't an external function
        store.setState({ mounted: true });
      }
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
    ({ enabled, streamKey, __controls, __initialProps }) => ({
      enabled,
      ingestUrl: __initialProps.ingestUrl,
      streamKey,
      requestedForceRenegotiateLastTime:
        __controls.requestedForceRenegotiateLastTime,
    }),
    async ({ enabled, streamKey, ingestUrl }) => {
      await cleanupWhip?.();

      if (!enabled) {
        return;
      }

      let unmounted = false;

      const onErrorComposed = (err: Error) => {
        if (!unmounted) {
          mediaStore.getState().__controlsFunctions.setLive(false);
          mediaStore.getState().__controlsFunctions?.onError?.(err);
        }
      };

      const { destroy } = createNewWHIP({
        ingestUrl: `${ingestUrl}/${streamKey}`,
        element,
        callbacks: {
          onConnected: () => {
            mediaStore.getState().__controlsFunctions.setLive(true);
            mediaStore.getState().__controlsFunctions.onError(null);
          },
          onRTCPeerConnection: (peerConnection) => {
            store
              .getState()
              .__controlsFunctions.setPeerConnection(peerConnection);
          },
          onError: onErrorComposed,
        },
        sdpTimeout: null,
      });

      cleanupWhip = () => {
        unmounted = true;
        destroy?.();
      };
    },
    {
      equalityFn: (a, b) =>
        a.requestedForceRenegotiateLastTime ===
          b.requestedForceRenegotiateLastTime &&
        a.streamKey === b.streamKey &&
        a.enabled === b.enabled,
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
      previousMediaStream: state.mediaStream,
    }),
    async ({
      hydrated,
      mounted,
      audio,
      video,
      requestedAudioDeviceId,
      requestedVideoDeviceId,
      previousMediaStream,
    }) => {
      try {
        if (!mounted || !hydrated) {
          return;
        }

        if (!audio && !video) {
          warn("Audio and video are both not enabled.");

          return;
        }

        const stream = await (requestedVideoDeviceId === "screen"
          ? getDisplayMedia({
              // for now, only the microphone audio track is supported - we don't support multiple
              // discrete audio tracks
              audio: false,

              // we assume that if the user is requested to share screen, they want to enable video,
              // and we don't listen to the `video` enabled state
              video: true,
            })
          : getUserMedia({
              audio:
                audio &&
                requestedAudioDeviceId &&
                requestedAudioDeviceId !== "default"
                  ? {
                      deviceId: {
                        // we pass ideal here, so we don't get overconstrained errors
                        ideal: requestedAudioDeviceId,
                      },
                    }
                  : Boolean(audio),
              video:
                video &&
                requestedVideoDeviceId &&
                requestedVideoDeviceId !== "default"
                  ? {
                      deviceId: {
                        // we pass ideal here, so we don't get overconstrained errors
                        ideal: requestedVideoDeviceId,
                      },
                    }
                  : Boolean(video),
            }));

        if (stream) {
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
          const mergedVideoTrack =
            allVideoTracks?.[0] ??
            previousMediaStream?.getVideoTracks?.()?.[0] ??
            null;

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
    }),
    async ({ audio, video, mediaStream }) => {
      if (mediaStream) {
        await setMediaStreamTracksStatus({
          mediaStream,
          enableAudio: Boolean(audio),
          enableVideo: Boolean(video),
        });
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

  return () => {
    destroyAudioVideoEnabled?.();
    destroyErrorCount?.();
    destroyMapDeviceListToFriendly?.();
    destroyMediaStream?.();
    destroyMediaSyncError?.();
    destroyMediaSyncMounted?.();
    destroyPeerConnectionAndMediaStream?.();
    destroyPictureInPictureSupportedMonitor?.();
    destroyRequestUserMedia?.();
    destroyUpdateDeviceList?.();
    destroyWhip?.();

    cleanupWhip?.();
    cleanupMediaStream?.();
  };
};
