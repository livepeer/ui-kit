import {
  ControlsOptions,
  MediaControllerCallbackState,
  MediaPropsOptions,
  PlaybackInfo,
  Src,
  WebhookPlaybackPolicy,
  isAccessControlError,
  isBframesError,
  isNotAcceptableError,
  isStreamOfflineError,
} from '@livepeer/core';
import { AspectRatio, ThemeConfig } from '@livepeer/core/media';
import { isNumber } from '@livepeer/core/utils';

import * as React from 'react';

import { useSourceMimeTyped } from './useSourceMimeTyped';
import { ControlsError, ObjectFit } from '../shared';

export type InternalPlayerProps = {
  /** The current screen width. This is null if the screen size cannot be determined (SSR). */
  _screenWidth: number | null;
};

export type PlayerProps<
  TElement,
  TPoster,
  TPlaybackPolicyObject extends object,
  TSlice,
> = {
  /** The source(s) of the media (**required** if `playbackId` or `playbackInfo` is not provided) */
  src?: string | string[] | null | undefined;
  /** The playback ID for the media (**required** if `src` or `playbackInfo` is not provided) */
  playbackId?: string | null | undefined;
  /** The playback ID for the media (**required** if `src` or `playbackId` is not provided) */
  playbackInfo?: PlaybackInfo | null | undefined;

  /** The title of the media */
  title?: string;
  /** Shows/hides the title at the top of the media */
  showTitle?: boolean;

  /** Whether the media will loop when finished. Defaults to false. */
  loop?: boolean;

  /**
   * The aspect ratio of the media. Defaults to 16to9 (16 / 9).
   * This significantly improves the cumulative layout shift and is required for the player.
   *
   * @see {@link https://web.dev/cls/}
   */
  aspectRatio?: AspectRatio;
  /**
   * Poster image to show when the content is either loading (when autoplaying) or hasn't started yet (without autoplay).
   * It is highly recommended to also pass in a `title` attribute as well, for ARIA compatibility.
   */
  poster?: TPoster;
  /** Enables/disables the loading spinner */
  showLoadingSpinner?: boolean;
  /** Enables/disables the dStorage uploading indicator (text and progress percentage) */
  showUploadingIndicator?: boolean;

  /** Configuration for the event listeners */
  controls?: ControlsOptions;
  /**
   * Play media automatically when the content loads
   */
  autoPlay?: boolean;
  /** Mute media by default */
  muted?: boolean;

  /**
   * When true, the media will be considered high priority and preload. Lazy loading is automatically disabled for media using `priority`.
   * You should use the priority property on any media detected as the Largest Contentful Paint (LCP) element. It may be appropriate to have multiple, as different content may be the LCP element for different viewport sizes.
   *
   * Should only be used when the media is visible above the fold. Defaults to false.
   */
  priority?: boolean;
  /** If the element is currently shown on the DOM/screen. This should typically not be used by SDK users. */
  _isCurrentlyShown?: boolean;

  /** Theme configuration for the player */
  theme?: ThemeConfig;

  /** The object-fit property for the video element. Defaults to cover (contain is usually used in full-screen applications) */
  objectFit?: ObjectFit;

  /** Custom controls passed in to override the default controls */
  children?: React.ReactNode;

  /** The refetch interval for the playback info hook (used with `playbackId` to query until there is a valid playback URL) */
  refetchPlaybackInfoInterval?: number;

  /**
   * If a decentralized identifier (an IPFS CID/URL) should automatically be uploaded as an Asset if playback info does not exist.
   * A custom gateway can also be specified, which is used to play back the asset directly from dStorage (only the domain needs to be passed, e.g. `https://ipfs.fleek.co`).
   *
   * Defaults to auto upload with fallback to play from dStorage until the asset is uploaded.
   */
  autoUrlUpload?:
    | boolean
    | { fallback: true; ipfsGateway?: string; arweaveGateway?: string };

  /** The wallet ID of the user who is viewing the media. This is used to track viewership for specific wallet IDs. */
  viewerId?: string;

  /** The JWT which is passed along to allow playback of an asset. */
  jwt?: string;

  /** An access key to be used for playback. */
  accessKey?: string;
  /** Callback to create an access key dynamically based on the playback policies. */
  onAccessKeyRequest?: (
    playbackPolicy: WebhookPlaybackPolicy<TPlaybackPolicyObject>,
  ) => Promise<string | null | undefined> | string | null | undefined;

  /**
   * Whether the children should be rendered outside of the aspect ratio container.
   * This is used for custom controls, so children of the Player can use
   * `useMediaController` without any parent elements.
   */
  renderChildrenOutsideContainer?: boolean;

  /** Callback called when the stream status changes (live or offline) */
  onStreamStatusChange?: (isLive: boolean) => void;

  /** Callback called when the access control errors */
  onAccessControlError?: (error: Error) => void;

  /** Callback called when the media sources are changed */
  onSourceUpdated?: (sources: Src[]) => void;

  /** Callback called when an error occurs that is not access control or metrics */
  onError?: (error: Error) => void;

  /** Callback ref passed to the underlying media element. Simple refs are not supported, due to the use of HLS.js under the hood. */
  mediaElementRef?: React.RefCallback<TElement | null | undefined>;

  /** Callback called when the broadcast status updates. **This should be used with `playbackStatusSelector` to limit state updates.** */
  onPlaybackStatusUpdate?: (state: TSlice, previousState: TSlice) => any;
  /** Selector used with `onPlaybackStatusUpdate`. */
  playbackStatusSelector?: (
    state: MediaControllerCallbackState<TElement, never>,
  ) => TSlice;
};

export const usePlayer = <
  TElement,
  TPoster,
  TPlaybackPolicyObject extends object,
  TSlice,
>(
  {
    autoPlay,
    children,
    controls,
    muted,
    playbackId,

    src,
    playbackInfo,
    theme,
    title,
    poster,
    loop,

    onStreamStatusChange,
    onAccessControlError,
    onError,
    onSourceUpdated,
    jwt,

    viewerId,

    refetchPlaybackInfoInterval = 5000,
    autoUrlUpload = true,

    accessKey,
    onAccessKeyRequest,

    showLoadingSpinner = true,
    showUploadingIndicator = true,
    showTitle = true,
    priority,
    aspectRatio = '16to9',
    objectFit = 'contain',
    mediaElementRef,
    _isCurrentlyShown,

    onPlaybackStatusUpdate,
    playbackStatusSelector,

    renderChildrenOutsideContainer,
  }: PlayerProps<TElement, TPoster, TPlaybackPolicyObject, TSlice>,
  { _screenWidth }: InternalPlayerProps,
) => {
  const [mediaElement, setMediaElement] = React.useState<TElement | null>(null);

  const { source, uploadStatus } = useSourceMimeTyped({
    src,
    playbackId,
    jwt,
    refetchPlaybackInfoInterval,
    autoUrlUpload,
    screenWidth: _screenWidth,
    playbackInfo,
    accessKey,
    onAccessKeyRequest,
  });

  const [playbackError, setPlaybackError] =
    React.useState<ControlsError | null>(null);

  const onPlaybackError = React.useCallback(
    (error: Error | null) => {
      const newPlaybackError: ControlsError | null = error
        ? {
            type: isAccessControlError(error)
              ? 'access-control'
              : isBframesError(error) || isNotAcceptableError(error)
              ? 'fallback'
              : isStreamOfflineError(error)
              ? 'offline'
              : 'unknown',
            message: error?.message ?? 'Error with playback.',
          }
        : null;

      setPlaybackError(newPlaybackError);

      try {
        if (newPlaybackError) {
          console.log(newPlaybackError);
        }

        if (!error) {
          onStreamStatusChange?.(true);
        } else if (newPlaybackError?.type === 'offline') {
          onStreamStatusChange?.(false);
        } else if (newPlaybackError?.type === 'access-control') {
          onAccessControlError?.(new Error(newPlaybackError.message));
        } else if (newPlaybackError?.message) {
          onError?.(new Error(newPlaybackError.message));
        }
      } catch (e) {
        //
      }

      return newPlaybackError;
    },

    [onAccessControlError, onStreamStatusChange, onError],
  );

  React.useEffect(() => {
    if (source) {
      onSourceUpdated?.(source);
      setPlaybackError(null);
    }
  }, [source, onSourceUpdated]);

  // if the source is priority or currently shown on the screen, then load
  const [hasBeenShown, setHasBeenShown] = React.useState(false);

  const loaded = React.useMemo(
    () => priority || _isCurrentlyShown || hasBeenShown,
    [priority, _isCurrentlyShown, hasBeenShown],
  );

  React.useEffect(() => {
    if (_isCurrentlyShown && !hasBeenShown) {
      setHasBeenShown(true);
    }
  }, [_isCurrentlyShown, hasBeenShown]);

  const hidePosterOnPlayed = React.useMemo(
    () =>
      Array.isArray(source)
        ? source?.[0]?.type !== 'audio'
          ? true
          : undefined
        : undefined,
    [source],
  );

  const playerRef = React.useCallback(
    (element: TElement | null) => {
      if (element) {
        setMediaElement(element);
        mediaElementRef?.(element);
      }
    },
    [mediaElementRef],
  );

  const loadingText = React.useMemo(
    () =>
      showUploadingIndicator
        ? uploadStatus?.phase === 'processing' &&
          isNumber(uploadStatus?.progress)
          ? `Processing: ${(Number(uploadStatus?.progress) * 100).toFixed(0)}%`
          : uploadStatus?.phase === 'failed'
          ? 'Upload Failed'
          : null
        : null,
    [uploadStatus, showUploadingIndicator],
  );

  const playerProps = React.useMemo(
    () => ({
      ref: playerRef,
      autoPlay,
      playbackId,
      muted,
      poster: poster,
      loop: loop,
      objectFit: objectFit,
      options: controls,
      priority: priority,
      playbackError,
      onPlaybackError,
      isCurrentlyShown: _isCurrentlyShown,
      viewerId,
      onPlaybackStatusUpdate,
      playbackStatusSelector,
    }),
    [
      playerRef,
      playbackId,
      autoPlay,
      muted,
      poster,
      loop,
      objectFit,
      controls,
      priority,
      playbackError,
      onPlaybackError,
      _isCurrentlyShown,
      viewerId,
      onPlaybackStatusUpdate,
      playbackStatusSelector,
    ],
  );

  const mediaControllerProps: MediaPropsOptions = React.useMemo(
    () => ({
      autoPlay,
      playbackId: playbackId ?? undefined,
      muted,
      priority: priority,
      viewerId,
    }),
    [autoPlay, playbackId, muted, priority, viewerId],
  );

  const controlsContainerProps = React.useMemo(
    () => ({
      hidePosterOnPlayed,
      showLoadingSpinner,
      loadingText,
      showUploadingIndicator,
      error: playbackError,
    }),
    [
      hidePosterOnPlayed,
      showLoadingSpinner,
      loadingText,
      showUploadingIndicator,
      playbackError,
    ],
  );

  const props = React.useMemo(
    () => ({
      autoPlay,
      children,
      controls,
      playbackId,
      src,
      theme,
      title,
      poster,
      loop,
      jwt,
      refetchPlaybackInfoInterval,
      autoUrlUpload,
      showTitle,
      aspectRatio,
      objectFit,
      renderChildrenOutsideContainer,
      playbackError,
    }),
    [
      autoPlay,
      children,
      controls,
      playbackId,
      src,
      theme,
      title,
      poster,
      loop,
      jwt,
      refetchPlaybackInfoInterval,
      autoUrlUpload,
      showTitle,
      aspectRatio,
      objectFit,
      renderChildrenOutsideContainer,
      playbackError,
    ],
  );

  const sourceWithLoaded = React.useMemo(
    () => (loaded ? source : null),
    [loaded, source],
  );

  return {
    mediaElement,
    source: sourceWithLoaded,
    uploadStatus,
    playerProps,
    mediaControllerProps,
    controlsContainerProps,
    props,
  };
};
