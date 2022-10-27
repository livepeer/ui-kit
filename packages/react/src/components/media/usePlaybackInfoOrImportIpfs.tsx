import { HttpError } from 'livepeer';
import { parseCid } from 'livepeer/media';

import * as React from 'react';

import { useAsset, useCreateAsset, usePlaybackInfo } from '../../hooks';
import { PlayerProps } from './Player';

/**
 * Retrieves the playback info for a playback ID or source URL.
 * Automatically imports a source URL from IPFS if it is a valid CID.
 *
 * @param src Source URL for the media.
 * @param playbackId Playback ID of the media.
 */
export const usePlaybackInfoOrImportIpfs = (
  src: PlayerProps['src'],
  playbackId: PlayerProps['playbackId'],
  refetchPlaybackInfoInterval: number,
) => {
  const {
    mutate: importAsset,
    data: importedAsset,
    // status: importStatus,
    // error: importError,
  } = useCreateAsset();

  // const {
  //   data: asset,
  //   error: assetError,
  //   status: assetStatus,
  // } =

  useAsset({
    assetId: importedAsset?.id,
    refetchInterval: (asset) =>
      asset?.status?.phase !== 'ready' ? 5000 : false,
  });

  // check if the src or playbackId are IPFS sources (does not handle src arrays)
  const ipfsSrcOrPlaybackId = React.useMemo(
    () =>
      playbackId
        ? parseCid(playbackId)
        : !Array.isArray(src)
        ? parseCid(src)
        : null,
    [playbackId, src],
  );

  console.log({ ipfsSrcOrPlaybackId });

  const { data: playbackInfo, error: playbackInfoError } = usePlaybackInfo({
    // attempt to fetch if the source is IPFS, or a playback ID is provided
    playbackId: ipfsSrcOrPlaybackId?.cid ?? playbackId ?? undefined,
    refetchInterval: (info) => (info ? false : refetchPlaybackInfoInterval),
  });

  // trigger an import if the playback info had a 404 error and the asset is an IPFS source
  React.useEffect(() => {
    console.log({ playbackInfoError });

    if (
      ipfsSrcOrPlaybackId?.url &&
      ipfsSrcOrPlaybackId?.cid &&
      (playbackInfoError as HttpError)?.code === 404
    ) {
      importAsset({
        name: ipfsSrcOrPlaybackId.cid,
        url: ipfsSrcOrPlaybackId.url,
      });
    }
  }, [ipfsSrcOrPlaybackId, playbackInfoError, importAsset]);

  return playbackInfo;
};
