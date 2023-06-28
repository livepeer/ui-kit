import {
  ControlsOptions,
  MediaPropsOptions,
  isAccessControlError,
  isStreamOfflineError,
} from '@livepeer/core';
import { AspectRatio, ThemeConfig } from '@livepeer/core/media';

import * as React from 'react';

import { useLivepeerProvider } from '../../../hooks';
import { ControlsError, ObjectFit } from '../shared';

export type BroadcastProps<TElement> = {
  /** The stream key for the broadcast. This is required. */
  streamKey: string | null | undefined;

  /** The title of the media */
  title?: string;

  /**
   * The aspect ratio of the media. Defaults to 16to9 (16 / 9).
   * This significantly improves the cumulative layout shift and is required.
   *
   * @see {@link https://web.dev/cls/}
   */
  aspectRatio?: AspectRatio;

  /** Configuration for the event listeners */
  controls?: ControlsOptions;

  /** Theme configuration for the broadcast */
  theme?: ThemeConfig;

  /** The object-fit property for the video element. Defaults to cover (contain is usually used in full-screen applications) */
  objectFit?: ObjectFit;

  /** Custom controls passed in to override the default controls */
  children?: React.ReactNode;

  /** The wallet ID of the creator who is broadcasting the media. This is used to track broadcasts for specific wallet IDs. */
  creatorId?: string;

  /** Callback called when an error occurs */
  onError?: (error: Error) => void;

  /** Callback ref passed to the underlying media element. Simple refs are not supported, due to the use of HLS.js under the hood. */
  mediaElementRef?: React.RefCallback<TElement | null | undefined>;
};

export const useBroadcast = <TElement,>({
  streamKey,
  children,
  controls,

  theme,
  title,

  onError,

  creatorId,

  aspectRatio = '16to9',
  objectFit = 'contain',
  mediaElementRef,
}: BroadcastProps<TElement>) => {
  const provider = useLivepeerProvider();

  const ingestUrl = React.useMemo(() => {
    const baseUrl = provider.getConfig().webrtcIngestBaseUrl;

    if (!streamKey || !baseUrl) {
      return null;
    }

    return `${baseUrl}/${streamKey}`;
  }, [streamKey, provider]);

  const [mediaElement, setMediaElement] = React.useState<TElement | null>(null);

  const [broadcastError, setBroadcastError] =
    React.useState<ControlsError | null>(null);

  const onBroadcastError = React.useCallback(
    (error: Error | null) => {
      const newError: ControlsError | null = error
        ? {
            type: isAccessControlError(error)
              ? 'access-control'
              : isStreamOfflineError(error)
              ? 'offline'
              : 'unknown',
            message: error?.message ?? 'Error with playback.',
          }
        : null;

      setBroadcastError(newError);

      if (error) {
        console.warn(error);
        onError?.(error);
      }

      return error;
    },
    [onError],
  );

  React.useEffect(() => {
    if (streamKey) {
      setBroadcastError(null);
    }
  }, [streamKey]);

  const broadcastRef = React.useCallback(
    (element: TElement | null) => {
      if (element) {
        setMediaElement(element);
        mediaElementRef?.(element);
      }
    },
    [mediaElementRef],
  );

  const broadcastProps = React.useMemo(
    () => ({
      ref: broadcastRef,
      ingestUrl,
      objectFit: objectFit,
      options: controls,
      broadcastError,
      onBroadcastError,
      creatorId,
    }),
    [
      broadcastError,
      broadcastRef,
      controls,
      ingestUrl,
      objectFit,
      onBroadcastError,
      creatorId,
    ],
  );

  const mediaControllerProps: MediaPropsOptions = React.useMemo(
    () => ({
      autoPlay: false,
      playbackId: undefined,
      muted: false,
      priority: false,
      creatorId,
      ingestUrl: ingestUrl ?? undefined,
    }),
    [creatorId, ingestUrl],
  );

  const controlsContainerProps = React.useMemo(
    () => ({
      hidePosterOnPlayed: true,
      showLoadingSpinner: true,
      loadingText: null,
      showUploadingIndicator: false,
      error: broadcastError,
    }),
    [broadcastError],
  );

  const props = React.useMemo(
    () => ({
      ingestUrl,
      children,
      controls,
      theme,
      title,
      aspectRatio,
      objectFit,
      onBroadcastError,
    }),
    [
      ingestUrl,
      aspectRatio,
      children,
      controls,
      objectFit,
      theme,
      title,
      onBroadcastError,
    ],
  );

  return {
    mediaElement,
    broadcastProps,
    mediaControllerProps,
    controlsContainerProps,
    props,
  };
};
