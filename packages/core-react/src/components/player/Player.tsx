import { ControlsOptions } from 'livepeer';
import { AspectRatio, ThemeConfig } from 'livepeer/media';
import { isNumber } from 'livepeer/utils';

import * as React from 'react';

import { useSourceMimeTyped } from './useSourceMimeTyped';

export type PlayerObjectFit = 'cover' | 'contain';

export type PlayerProps<TPoster = string> = {
  /** The source(s) of the media (**required** if `playbackId` is not provided) */
  src?: string | string[] | null | undefined;
  /** The playback ID for the media (**required** if `src` is not provided) */
  playbackId?: string | null | undefined;

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
   * */
  aspectRatio?: AspectRatio;
  /**
   * Poster image to show when the content is either loading (when autoplaying) or hasn't started yet (without autoplay).
   * It is highly recommended to also pass in a `title` attribute as well, for ARIA compatibility.
   */
  poster?: TPoster;
  /** Enables/disables the loading spinner */
  shouldShowLoadingSpinner?: boolean;

  /** Configuration for the event listeners */
  controls?: ControlsOptions;
  /**
   * Play media automatically when the content loads (if this is specified, you must also specify muted,
   * since this is required in browsers)
   */
  autoPlay?: boolean;
  /** Mute media by default */
  muted?: boolean;

  /** Theme configuration for the player */
  theme?: ThemeConfig;

  /** The object-fit property for the video element. Defaults to cover (contain is usually used in full-screen applications) */
  objectFit?: PlayerObjectFit;

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

  /** If a decentralized identifier (an IPFS CID/URL) should automatically be imported as an Asset if playback info does not exist. Defaults to true. */
  jwt?: string;

  /** Callback called when the metrics plugin cannot be initialized properly */
  onMetricsError?: (error: Error) => void;
} & (
  | {
      src: string | string[] | null | undefined;
    }
  | { playbackId: string | null | undefined }
);

export const usePlayer = <TElement, TPoster>({
  autoPlay,
  children,
  controls,
  muted,
  playbackId,

  src,
  theme,
  title,
  poster,
  loop,

  onMetricsError,
  jwt,

  refetchPlaybackInfoInterval = 5000,
  autoUrlUpload = true,

  shouldShowLoadingSpinner = true,
  showTitle = true,
  aspectRatio = '16to9',
  objectFit = 'cover',
}: PlayerProps<TPoster>) => {
  const [mediaElement, setMediaElement] = React.useState<TElement | null>(null);

  const { source, uploadStatus } = useSourceMimeTyped({
    src,
    playbackId,
    jwt,
    refetchPlaybackInfoInterval,
    autoUrlUpload,
  });

  const hidePosterOnPlayed = React.useMemo(
    () =>
      Array.isArray(source)
        ? source?.[0]?.type !== 'audio'
          ? true
          : undefined
        : undefined,
    [source],
  );

  const playerRef = React.useCallback((element: TElement | null) => {
    if (element) {
      setMediaElement(element);
    }
  }, []);

  const loadingText = React.useMemo(
    () =>
      uploadStatus?.phase === 'processing' && isNumber(uploadStatus?.progress)
        ? `Processing: ${(Number(uploadStatus?.progress) * 100).toFixed(0)}%`
        : uploadStatus?.phase === 'failed'
        ? 'Upload Failed'
        : null,
    [uploadStatus],
  );

  return {
    mediaElement,
    source,
    uploadStatus,
    playerProps: {
      ref: playerRef,
      autoPlay,
      muted: autoPlay ? true : muted,
      poster: poster,
      loop: loop,
      objectFit: objectFit,
      options: controls,
    },
    controlsContainerProps: {
      hidePosterOnPlayed,
      shouldShowLoadingSpinner,
      loadingText,
    },
    props: {
      autoPlay,
      children,
      controls,
      playbackId,
      src,
      theme,
      title,
      poster,
      loop,
      onMetricsError,
      jwt,
      refetchPlaybackInfoInterval,
      autoUrlUpload,
      showTitle,
      aspectRatio,
      objectFit,
    },
  };
};
