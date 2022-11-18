import { Asset, HttpError } from 'livepeer';
import { parseCid } from 'livepeer/media';

import * as React from 'react';

import { useAsset, useCreateAsset, usePlaybackInfo } from '../../hooks';
import { PlayerProps } from './Player';

export type UsePlaybackInfoOrImportProps = {
  decentralizedSrcOrPlaybackId: ReturnType<typeof parseCid>;
  playbackId: PlayerProps['playbackId'];
  refetchPlaybackInfoInterval: number;
  autoUrlUpload: boolean;
  onAssetStatusChange: (status: Asset['status']) => void;
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
    data: importedAsset,
    status,
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

  const { data: asset } = useAsset({
    assetId: importedAsset?.[0]?.id,
    refetchInterval: (asset) =>
      asset?.status?.phase !== 'ready' ? refetchPlaybackInfoInterval : false,
  });

  React.useEffect(() => {
    if (asset?.status) {
      onAssetStatusChange(asset.status);
    }
  }, [asset?.status, onAssetStatusChange]);

  const { data: playbackInfo, error: playbackInfoError } = usePlaybackInfo({
    // attempt to fetch if the source is from decentralized storage, or a playback ID is provided
    playbackId: decentralizedSrcOrPlaybackId?.id ?? playbackId ?? undefined,
    refetchInterval: (info) => (info ? false : refetchPlaybackInfoInterval),
  });

  // trigger an import if the playback info had a 404 error and the asset is an IPFS source
  // also must be enabled
  React.useEffect(() => {
    if (
      autoUrlUpload &&
      importAsset &&
      status === 'idle' &&
      (playbackInfoError as HttpError)?.code === 404
    ) {
      importAsset();
    }
  }, [autoUrlUpload, playbackInfoError, importAsset, status]);

  return playbackInfo;
};
