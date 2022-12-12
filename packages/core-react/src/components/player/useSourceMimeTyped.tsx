import { AudioSrc, Src, VideoSrc, getMediaSourceType } from '@livepeer/core';
import { CreateAssetUrlProgress } from '@livepeer/core/types';
import { parseArweaveTxId, parseCid } from '@livepeer/core/utils';

import * as React from 'react';

import { PlayerProps } from './Player';
import { usePlaybackInfoOrImport } from './usePlaybackInfoOrImport';

const defaultIpfsGateway = 'https://w3s.link';
const defaultArweaveGateway = 'https://arweave.net';

export type UseSourceMimeTypedProps<TElement, TPoster> = {
  src: PlayerProps<TElement, TPoster>['src'];
  playbackId: PlayerProps<TElement, TPoster>['playbackId'];
  refetchPlaybackInfoInterval: NonNullable<
    PlayerProps<TElement, TPoster>['refetchPlaybackInfoInterval']
  >;
  autoUrlUpload: NonNullable<PlayerProps<TElement, TPoster>['autoUrlUpload']>;
  jwt: PlayerProps<TElement, TPoster>['jwt'];
};

export const useSourceMimeTyped = <TElement, TPoster>({
  src,
  playbackId,
  jwt,
  refetchPlaybackInfoInterval,
  autoUrlUpload = { fallback: true },
}: UseSourceMimeTypedProps<TElement, TPoster>) => {
  const [uploadStatus, setUploadStatus] =
    React.useState<CreateAssetUrlProgress | null>(null);

  const onAssetStatusChange = React.useCallback(
    (status: CreateAssetUrlProgress) => {
      setUploadStatus(status);
    },
    [setUploadStatus],
  );

  // check if the src or playbackId are decentralized storage sources (does not handle src arrays)
  const decentralizedSrcOrPlaybackId = React.useMemo(
    () =>
      playbackId
        ? parseCid(playbackId) ?? parseArweaveTxId(playbackId)
        : !Array.isArray(src)
        ? parseCid(src) ?? parseArweaveTxId(src)
        : null,
    [playbackId, src],
  );

  const playbackInfo = usePlaybackInfoOrImport({
    decentralizedSrcOrPlaybackId,
    playbackId,
    refetchPlaybackInfoInterval,
    autoUrlUpload,
    onAssetStatusChange,
  });

  const [playbackUrls, setPlaybackUrls] = React.useState<string[]>([]);

  React.useEffect(() => {
    const playbackInfoSources = playbackInfo?.meta?.source
      ?.map((s) => s?.url)
      ?.filter((s) => s);

    if (playbackInfoSources) {
      setPlaybackUrls(playbackInfoSources);
    }
  }, [playbackInfo]);

  const sourceMimeTyped = React.useMemo(() => {
    // if the player is auto uploading, we do not play back the detected input file unless specified
    // e.g. https://arweave.net/84KylA52FVGLxyvLADn1Pm8Q3kt8JJM74B87MeoBt2w/400019.mp4
    if (decentralizedSrcOrPlaybackId) {
      if (!autoUrlUpload) {
        return null;
      } else {
        if (typeof autoUrlUpload !== 'boolean') {
          if (decentralizedSrcOrPlaybackId.url.startsWith('ar://')) {
            const { host } = new URL(
              autoUrlUpload.arweaveGateway ?? defaultArweaveGateway,
            );

            const src: VideoSrc[] = [
              {
                type: 'video',
                mime: 'video/mp4',
                src: `https://${host}/${decentralizedSrcOrPlaybackId.id}` as VideoSrc['src'],
              },
            ];

            return src;
          } else if (decentralizedSrcOrPlaybackId.url.startsWith('ipfs://')) {
            const { host } = new URL(
              autoUrlUpload.ipfsGateway ?? defaultIpfsGateway,
            );

            const src: VideoSrc[] = [
              {
                type: 'video',
                mime: 'video/mp4',
                src: `https://${host}/ipfs/${decentralizedSrcOrPlaybackId.id}` as VideoSrc['src'],
              },
            ];

            return src;
          }
        }
      }
    }

    // cast all URLs to an array of strings
    const sources =
      playbackUrls.length > 0
        ? playbackUrls
        : typeof src === 'string'
        ? [src]
        : src;

    if (!sources) {
      return null;
    }

    const authenticatedSources = sources.map((source) => {
      // append the JWT to the query params
      if (jwt) {
        const url = new URL(source);
        url.searchParams.append('jwt', jwt);
        return url.toString();
      }

      return source;
    });

    const mediaSourceTypes = authenticatedSources
      .map((s) => (typeof s === 'string' ? getMediaSourceType(s) : s))
      .filter((s) => s) as Src[];

    // if there are multiple Hls sources, we take only the first one
    // otherwise we pass all sources to the video or audio player components
    if (
      mediaSourceTypes.every((s) => s.type === 'hls') &&
      mediaSourceTypes?.[0]?.type === 'hls'
    ) {
      return mediaSourceTypes[0];
    }

    // we filter by the first source type in the array provided
    const mediaSourceFiltered =
      mediaSourceTypes?.[0]?.type === 'audio'
        ? (mediaSourceTypes.filter((s) => s.type === 'audio') as AudioSrc[])
        : mediaSourceTypes?.[0]?.type === 'video'
        ? (mediaSourceTypes.filter((s) => s.type === 'video') as VideoSrc[])
        : null;

    return mediaSourceFiltered;
  }, [decentralizedSrcOrPlaybackId, playbackUrls, src, autoUrlUpload, jwt]);

  return { source: sourceMimeTyped, uploadStatus } as const;
};
