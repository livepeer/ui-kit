import {
  AudioSrc,
  HlsSrc,
  Src,
  VideoSrc,
  getMediaSourceType,
} from '@livepeer/core';
import { CreateAssetUrlProgress } from '@livepeer/core/types';
import { parseArweaveTxId, parseCid } from '@livepeer/core/utils';
import * as React from 'react';

import { InternalPlayerProps, PlayerProps } from './Player';
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
  screenWidth: InternalPlayerProps['_screenWidth'];
};

type PlaybackUrlWithInfo = {
  url: string;
  rendition: '360p' | null; // TODO
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

  const [playbackUrls, setPlaybackUrls] = React.useState<PlaybackUrlWithInfo[]>(
    [],
  );

  React.useEffect(() => {
    const playbackInfoSources: PlaybackUrlWithInfo[] | null =
      playbackInfo?.meta?.source?.map((s) => ({
        url: s?.url,
        rendition: s?.rendition === '360p' ? '360p' : null,
      })) ?? null;

    if (playbackInfoSources) {
      setPlaybackUrls(playbackInfoSources);
    }
  }, [playbackInfo]);

  const dStoragePlaybackUrl = React.useMemo(() => {
    // if the player is auto uploading, we do not play back the detected input file unless specified
    // e.g. https://arweave.net/84KylA52FVGLxyvLADn1Pm8Q3kt8JJM74B87MeoBt2w/400019.mp4
    if (
      decentralizedSrcOrPlaybackId &&
      autoUrlUpload &&
      typeof autoUrlUpload !== 'boolean'
    ) {
      if (decentralizedSrcOrPlaybackId.url.startsWith('ar://')) {
        const { host } = new URL(
          autoUrlUpload.arweaveGateway ?? defaultArweaveGateway,
        );

        const src: VideoSrc = {
          type: 'video',
          mime: 'video/mp4',
          src: `https://${host}/${decentralizedSrcOrPlaybackId.id}` as VideoSrc['src'],
        };

        return src;
      } else if (decentralizedSrcOrPlaybackId.url.startsWith('ipfs://')) {
        const { host } = new URL(
          autoUrlUpload.ipfsGateway ?? defaultIpfsGateway,
        );

        const src: VideoSrc = {
          type: 'video',
          mime: 'video/mp4',
          src: `https://${host}/ipfs/${decentralizedSrcOrPlaybackId.id}` as VideoSrc['src'],
        };

        return src;
      }
    }

    return null;
  }, [autoUrlUpload, decentralizedSrcOrPlaybackId]);

  const sourceMimeTyped = React.useMemo(() => {
    // cast all URLs to an array of strings
    const sources =
      playbackUrls.length > 0
        ? playbackUrls.map((p) => p.url)
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
      .map((s) => (typeof s === 'string' ? getMediaSourceType(s) : null))
      .filter((s) => s) as Src[];

    // we filter by either audio or video/hls
    const mediaSourceFiltered =
      mediaSourceTypes?.[0]?.type === 'audio'
        ? (mediaSourceTypes.filter((s) => s.type === 'audio') as AudioSrc[])
        : mediaSourceTypes?.[0]?.type === 'video' ||
          mediaSourceTypes?.[0]?.type === 'hls'
        ? (mediaSourceTypes.filter(
            (s) => s.type === 'video' || s.type === 'hls',
          ) as (VideoSrc | HlsSrc)[])
        : null;

    return mediaSourceFiltered;
  }, [playbackUrls, src, jwt]);

  const sourceMimeTypedSorted = React.useMemo(() => {
    // if there is no source mime type and the Player has dstorage fallback enabled,
    // we attempt to play from the dstorage URL directly
    if (!sourceMimeTyped && dStoragePlaybackUrl) {
      return [dStoragePlaybackUrl];
    }

    if (
      sourceMimeTyped?.[0]?.type === 'video' ||
      sourceMimeTyped?.[0]?.type === 'hls'
    ) {
      // const screenWidthWithDefault = screenWidth ?? 1280;
      const previousSources = [...sourceMimeTyped] as (HlsSrc | VideoSrc)[];

      return previousSources.sort((a, b) => {
        // TODO add sorting logic for size/screenWidth
        // if (screenWidthWithDefault > 1280) {
        //   return a.type === 'video' && b.type === 'hls' ? -1 : 1;
        // }

        return a.type === 'video' && b.type === 'hls' ? -1 : 1;
      });
    }

    return sourceMimeTyped;
  }, [sourceMimeTyped, dStoragePlaybackUrl]);

  return {
    source: sourceMimeTypedSorted,
    uploadStatus,
  } as const;
};
