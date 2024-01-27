import { omit } from "@livepeer/core";
import {
  DEFAULT_VOLUME_LEVEL,
  MediaControllerStore,
  getBoundedVolume,
} from "@livepeer/core/media";
import { ClientStorage } from "@livepeer/core/storage";
import {
  createJSONStorage,
  persist,
  subscribeWithSelector,
} from "zustand/middleware";
import { StoreApi, createStore } from "zustand/vanilla";

import { getRTCPeerConnectionConstructor } from "./webrtc/shared";
import {
  attachMediaStreamToPeerConnection,
  createNewWHIP,
  getDisplayMedia,
  getMediaDevices,
  getUserMedia,
} from "./webrtc/whip";

const defaultIngestUrl = "https://playback.livepeer.studio/webrtc";

const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export type MediaDeviceIds = {
  [key in MediaDeviceKind]: string | null;
} & {
  screeninput: string | null;
};

export type RTCRtpSenders = {
  audio: RTCRtpSender | null;
  video: RTCRtpSender | null;
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
});

export type BroadcastDeviceInformation = {
  version: string;

  /** If the environment supports mediaDevices */
  isMediaDevicesSupported: boolean;
  /** If the environment supports RTCPeerConnection */
  isRTCPeerConnectionSupported: boolean;
};

export type BroadcastControlsState = {
  /** The last time that display media was requested */
  requestedDisplayMediaLastTime: number;
  /** The last time that a force update was requested */
  requestedForceUpdateLastTime: number;
  /** The last time that the device list was requested */
  requestedUpdateDeviceListLastTime: number;
  /** The last time that the user media was requested */
  requestedUserMediaLastTime: number;
  /** The requested audio input device ID */
  requestedAudioInputDeviceId: string | null;
  /** The requested video input device ID */
  requestedVideoInputDeviceId: string | null;

  /** If the volume is muted */
  muted: boolean;
  /** The volume, doesn't change when muted */
  volume: number;
};

export type InitialBroadcastProps = {
  /**
   * The aspect ratio for the container element
   */
  aspectRatio: number | null;

  /**
   * The ingest URL for the WHIP WebRTC broadcast.
   *
   * Defaults to Livepeer Studio (`https://playback.livepeer.studio/webrtc`).
   */
  ingestUrl: string;
  /** The creatorId for the broadcast component */
  creatorId: string | null;

  /** The volume that was passed in to the Player */
  volume: number;
  /**
   * Whether the WebRTC stream should attempt to initialize immediately after the user grants
   * permission to their video/audio input.
   *
   * Defaults to `false`, where preview is shown and then once the stream is enabled, it sends
   * media to the server.
   */
  forceEnabled?: boolean;
};

const omittedKeys = [
  "__initialProps",
  "__device",
  "__controls",
  "__controlsFunctions",
] as const;

export const sanitizeBroadcastState = (
  state: BroadcastState,
): BroadcastCallbackState => omit(state, ...omittedKeys);

export type BroadcastCallbackState = Omit<
  BroadcastState,
  (typeof omittedKeys)[number]
>;

export type BroadcastAriaText = {
  start: string;
  screenshareTrigger: string;
  videoTrigger: string;
};

export type BroadcastState = {
  /** The ARIA text for the current state */
  aria: BroadcastAriaText;

  /** Whether the broadcast is currently enabled, or in "preview" mode. */
  enabled: boolean;

  /**
   * A list of the current media devices. This will change when permissions change.
   */
  mediaDevices: MediaDeviceInfoExtended[] | null;

  /** The MediaStream for the current broadcast. */
  mediaStream: MediaStream | null;

  /** The RTCPeerConnection for the current broadcast. */
  peerConnection: RTCPeerConnection | null;

  /**
   * The stream key to use for the broadcast.
   */
  streamKey: string | null;

  /** If video is enabled (only applies to broadcasting) */
  video: boolean | null;

  /** Current volume of the broadcast. 0 if it is muted. */
  volume: number;

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
    requestDisplayMedia: () => void;
    requestForceUpdate: () => void;
    requestMediaDeviceId: (
      deviceId: string,
      type: keyof MediaDeviceIds,
    ) => void;
    requestToggleMute: () => void;
    requestUserMedia: () => void;
    requestVolume: (volume: number) => void;
    setPeerConnection: (peerConnection: RTCPeerConnection) => void;
    setMediaDeviceId: (deviceId: string, type: keyof MediaDeviceIds) => void;
    setStreamKey: (streamKey: string) => void;
    setVolume: (volume: number) => void;
    toggleEnabled: () => void;
    toggleVideo: () => void;
    updateDeviceList: (mediaDevices: MediaDeviceInfoExtended[]) => void;
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
}): BroadcastStore => {
  const initialVolume = getBoundedVolume(
    initialProps.volume ?? DEFAULT_VOLUME_LEVEL,
  );

  const initialControls: BroadcastControlsState = {
    volume: initialVolume,
    muted: initialVolume === 0,
    requestedUserMediaLastTime: 0,
    requestedUpdateDeviceListLastTime: 0,
    requestedForceUpdateLastTime: 0,
    requestedDisplayMediaLastTime: 0,
    requestedAudioInputDeviceId: null,
    requestedVideoInputDeviceId: null,
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
          volume: initialVolume,

          enabled: initialProps?.forceEnabled ?? false,

          mediaStream: null,

          mediaDevices: null,

          peerConnection: null,

          streamKey: streamKey ?? null,

          /** If video is enabled (only applies to broadcasting) */
          video: null,

          mediaDeviceIds: {
            audioinput: null,
            videoinput: null,
            audiooutput: null,
            screeninput: null,
          },

          senders: {
            audio: null,
            video: null,
          },

          aria: {
            start: "Start broadcasting (b)",
            screenshareTrigger: "Share screen ()",
            videoTrigger: "Turn video off (v)",
          },

          __initialProps: {
            aspectRatio: initialProps?.aspectRatio ?? null,

            volume: initialVolume ?? null,

            creatorId: initialProps.creatorId ?? null,

            ingestUrl: initialProps?.ingestUrl ?? defaultIngestUrl,
            forceEnabled: initialProps?.forceEnabled ?? false,
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

            requestForceUpdate: () =>
              set(({ __controls }) => ({
                __controls: {
                  ...__controls,
                  requestedForceUpdateLastTime: Date.now(),
                },
              })),

            requestDisplayMedia: () =>
              set(({ __controls }) => ({
                __controls: {
                  ...__controls,
                  requestedDisplayMediaLastTime: Date.now(),
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

            setMediaDeviceId: (deviceId, type) =>
              set(({ mediaDeviceIds }) => ({
                mediaDeviceIds: {
                  ...mediaDeviceIds,
                  [type]: deviceId,
                },
              })),

            updateDeviceList: (mediaDevices) =>
              set(() => ({
                mediaDevices,
              })),

            requestDeviceListInfo: () =>
              set(({ __controls }) => ({
                __controls: {
                  ...__controls,
                  requestedUpdateDeviceListLastTime: Date.now(),
                },
              })),

            requestUserMedia: () =>
              set(({ __controls }) => ({
                __controls: {
                  ...__controls,
                  requestedUserMediaLastTime: Date.now(),
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

            requestVolume: (newVolume) =>
              set(({ __controls }) => ({
                volume: getBoundedVolume(newVolume),
                __controls: {
                  ...__controls,
                  volume:
                    newVolume === 0 ? newVolume : getBoundedVolume(newVolume),
                  muted: newVolume === 0,
                },
              })),
            setVolume: (newVolume) =>
              set(({ __controls }) => ({
                volume: getBoundedVolume(newVolume),
                __controls: {
                  ...__controls,
                  volume: getBoundedVolume(newVolume),
                },
              })),

            requestToggleMute: () =>
              set(({ volume, __controls }) => ({
                volume: volume !== 0 ? 0 : __controls.volume,
                __controls: {
                  ...__controls,
                  muted: !__controls.muted,
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
          // since these values are persisted across media, only persist volume
          partialize: ({ volume }) => ({
            volume,
          }),
          storage: createJSONStorage(() => storage),
        },
      ),
    ),
  );

  return store;
};

const MEDIA_BROADCAST_INITIALIZED_ATTRIBUTE =
  "data-livepeer-broadcast-initialized";

const allKeyTriggers = ["KeyL", "KeyV", "KeyB", "Space"] as const;
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
        store.getState().__controlsFunctions.requestToggleMute();
      } else if (code === "KeyV") {
        store.getState().__controlsFunctions.toggleVideo();
      } else if (code === "KeyB") {
        store.getState().__controlsFunctions.toggleEnabled();
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
      if (mediaStore.getState().__initialProps.hotkeys) {
        parentElementOrElement.addEventListener("keyup", onKeyUp);
        parentElementOrElement.setAttribute("tabindex", "0");
      }
    }

    element.setAttribute(MEDIA_BROADCAST_INITIALIZED_ATTRIBUTE, "true");
  }

  // add effects
  const removeEffectsFromStore = addEffectsToStore(element, store, mediaStore);

  const destroy = () => {
    parentElementOrElement?.removeEventListener?.("keyup", onKeyUp);

    mediaDevices?.removeEventListener?.("devicechange", onDeviceChange);

    removeEffectsFromStore?.();

    element?.removeAttribute?.(MEDIA_BROADCAST_INITIALIZED_ATTRIBUTE);
  };

  return {
    destroy: () => {
      destroy?.();
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
  // Subscribe to request user media
  const destroyWhip = store.subscribe(
    ({ enabled, streamKey, __controls, __initialProps }) => ({
      enabled,
      ingestUrl: __initialProps.ingestUrl,
      streamKey,
      requestedForceUpdateLastTime: __controls.requestedForceUpdateLastTime,
    }),
    async ({ enabled, streamKey, ingestUrl }) => {
      await cleanupWhip?.();

      if (!enabled) {
        return;
      }

      const unmounted = false;

      // if (!mediaStream) {
      //   warn("No media stream detected.");

      //   return;
      // }

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
        destroy?.();
      };
    },
    {
      equalityFn: (a, b) =>
        a.requestedForceUpdateLastTime === b.requestedForceUpdateLastTime &&
        a.streamKey === b.streamKey &&
        a.enabled === b.enabled,
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

  // Subscribe to error count & mounted
  const destroyErrorCount = mediaStore.subscribe(
    ({ errorCount, mounted }) => ({ errorCount, mounted }),
    async ({ mounted, errorCount }) => {
      if (!mounted) {
        return;
      }

      if (errorCount > 0) {
        const delayTime = 500 * 2 ** (errorCount - 1);
        await delay(delayTime);
      }

      store.getState().__controlsFunctions.requestForceUpdate();
    },
    {
      equalityFn: (a, b) =>
        a.mounted === b.mounted && a.errorCount === b.errorCount,
    },
  );

  // Subscribe to mounted
  const destroyMounted = mediaStore.subscribe(
    ({ mounted }) => mounted,
    async (mounted) => {
      if (mounted) {
        store.getState().__controlsFunctions.requestDeviceListInfo();
        store.getState().__controlsFunctions.requestUserMedia();
      }
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

        element.addEventListener("loadedmetadata", togglePlay, { once: true });

        cleanupMediaStream = () => {
          element?.removeEventListener?.("loadedmetadata", togglePlay);

          element.srcObject = null;
        };
      }
    },
    {
      equalityFn: (a, b) => a?.id === b?.id,
    },
  );

  // Subscribe to media devices
  const destroyDisplayMedia = store.subscribe(
    (state) => state.__controls.requestedDisplayMediaLastTime,
    async () => {
      const displayMedia = await getDisplayMedia({
        video: true,
        audio: true,
      });

      if (displayMedia) {
        store.getState().__controlsFunctions.updateMediaStream(displayMedia);
      }
    },
  );

  // Subscribe to media devices
  const destroyUpdateDeviceList = store.subscribe(
    (state) => state.__controls.requestedUpdateDeviceListLastTime,
    async () => {
      const mediaDevices = getMediaDevices();
      const devices = await mediaDevices?.enumerateDevices();

      if (devices) {
        const extendedDevices: MediaDeviceInfoExtended[] = devices.map(
          (device, i) => ({
            deviceId: device.deviceId,
            kind: device.kind,
            groupId: device.groupId,
            label: device.label || null,
            friendlyName:
              device.label ??
              `${
                device.kind === "audioinput" ? "Audio Source" : "Video Source"
              } ${i + 1} (${
                device.deviceId === "default"
                  ? "default"
                  : device.deviceId.slice(0, 6)
              })`,
          }),
        );

        store.getState().__controlsFunctions.updateDeviceList(extendedDevices);
      }
    },
  );

  // Subscribe to request user media
  const destroyRequestUserMedia = store.subscribe(
    (state) => ({
      lastTime: state.__controls.requestedUserMediaLastTime,
      requestedAudioDeviceId: state.__controls.requestedAudioInputDeviceId,
      requestedVideoDeviceId: state.__controls.requestedVideoInputDeviceId,
    }),
    async ({ requestedAudioDeviceId, requestedVideoDeviceId }) => {
      const stream = await getUserMedia({
        video: requestedVideoDeviceId
          ? {
              deviceId: requestedVideoDeviceId,
            }
          : true,
        audio: requestedAudioDeviceId
          ? {
              deviceId: requestedAudioDeviceId,
            }
          : true,
      });

      const allTracks = stream?.getTracks() ?? [];

      const allAudioDeviceIds = allTracks
        .filter((track) => track.kind === "audio")
        .map((track) => track?.getSettings()?.deviceId);
      const allVideoDeviceIds = allTracks
        .filter((track) => track.kind === "video")
        .map((track) => track?.getSettings()?.deviceId);

      const firstAudioDeviceId = allAudioDeviceIds?.[0] ?? null;
      const firstVideoDeviceId = allVideoDeviceIds?.[0] ?? null;

      const deviceIds = stream
        ?.getTracks()
        .map((track) => track?.getSettings()?.deviceId);

      console.log({ stream, deviceIds, tracks: stream?.getTracks() });

      if (stream) {
        store.getState().__controlsFunctions.updateMediaStream(stream);
        if (firstAudioDeviceId) {
          store
            .getState()
            .__controlsFunctions.setMediaDeviceId(
              firstAudioDeviceId,
              "audioinput",
            );
        }
        if (firstVideoDeviceId) {
          store
            .getState()
            .__controlsFunctions.setMediaDeviceId(
              firstVideoDeviceId,
              "videoinput",
            );
        }
      }
    },
    {
      equalityFn: (a, b) =>
        a.lastTime === b.lastTime &&
        a.requestedAudioDeviceId === b.requestedAudioDeviceId &&
        a.requestedVideoDeviceId === b.requestedVideoDeviceId,
    },
  );

  return () => {
    destroyDisplayMedia?.();
    destroyErrorCount?.();
    destroyMediaStream?.();
    destroyMounted?.();
    destroyPeerConnectionAndMediaStream?.();
    destroyRequestUserMedia?.();
    destroyUpdateDeviceList?.();
    destroyWhip?.();

    cleanupWhip?.();
    cleanupMediaStream?.();
  };
};
