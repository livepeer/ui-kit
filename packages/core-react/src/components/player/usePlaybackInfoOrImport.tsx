import { HttpError } from 'livepeer';
import { CreateAssetUrlProgress } from 'livepeer/types';
import { parseCid } from 'livepeer/utils';

import * as React from 'react';

import { useCreateAsset, usePlaybackInfo } from '../../hooks';

import { PlayerProps } from './Player';

export type UsePlaybackInfoOrImportProps = {
  decentralizedSrcOrPlaybackId: ReturnType<typeof parseCid>;
  playbackId: PlayerProps['playbackId'];
  refetchPlaybackInfoInterval: number;
  autoUrlUpload: boolean | { fallback: true; gateway?: string };
  onAssetStatusChange: (status: CreateAssetUrlProgress) => void;
};

/**
 * Retrieves the playback info for a playback ID or source URL.
 * Conditionally, automatically imports a source URL from IPFS or Arweave.
 *
 * @param src Source URL for the media.
 * @param playbackId Playback ID of the media.
 */
export const usePlaybackInfoOrImport = ({
  decentralizedSrcOrPlaybackId,
  playbackId,
  refetchPlaybackInfoInterval,
  autoUrlUpload,
  onAssetStatusChange,
}: UsePlaybackInfoOrImportProps) => {
  const {
    mutate: importAsset,
    status,
    progress,
  } = useCreateAsset(
    decentralizedSrcOrPlaybackId
      ? ({
          sources: [
            {
              name: decentralizedSrcOrPlaybackId.id,
              url: decentralizedSrcOrPlaybackId.url,
            },
          ],
        } as const)
      : null,
  );

  React.useEffect(() => {
    if (progress?.[0]) {
      onAssetStatusChange(progress[0]);
    }
  }, [progress, onAssetStatusChange]);

  const { data: playbackInfo, error: playbackInfoError } = usePlaybackInfo({
    // attempt to fetch if the source is from decentralized storage, or a playback ID is provided
    playbackId: decentralizedSrcOrPlaybackId?.id ?? playbackId ?? undefined,
    refetchInterval: (info) => (info ? false : refetchPlaybackInfoInterval),
  });

  const playbackInfoErrorCode = React.useMemo(
    () => (playbackInfoError as HttpError)?.code,
    [playbackInfoError],
  );

  // trigger an import if the playback info had a 404 error and the asset is an IPFS source
  // also must be enabled
  React.useEffect(() => {
    if (
      autoUrlUpload &&
      importAsset &&
      status === 'idle' &&
      playbackInfoErrorCode === 404
    ) {
      importAsset();
    }
  }, [autoUrlUpload, playbackInfoErrorCode, importAsset, status]);

  return playbackInfo;
};
