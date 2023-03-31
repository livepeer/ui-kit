import {
  AudioSrc,
  HlsSrc,
  Src,
  VideoSrc,
  getMediaSourceType,
} from '@livepeer/core';
import {
  CreateAssetUrlProgress,
  WebhookPlaybackPolicy,
} from '@livepeer/core/types';
import { parseArweaveTxId, parseCid } from '@livepeer/core/utils';
import * as React from 'react';

import { InternalPlayerProps, PlayerProps } from './Player';
import { usePlaybackInfoOrImport } from './usePlaybackInfoOrImport';
import { useInternalQuery } from '../../utils';

const defaultIpfsGateway = 'https://w3s.link';
const defaultArweaveGateway = 'https://arweave.net';

export type UseSourceMimeTypedProps<
  TElement,
  TPoster,
  TPlaybackPolicyObject extends object,
> = {
  src: PlayerProps<TElement, TPoster, TPlaybackPolicyObject>['src'];
  playbackId: PlayerProps<
    TElement,
    TPoster,
    TPlaybackPolicyObject
  >['playbackId'];
  refetchPlaybackInfoInterval: NonNullable<
    PlayerProps<
      TElement,
      TPoster,
      TPlaybackPolicyObject
    >['refetchPlaybackInfoInterval']
  >;
  autoUrlUpload: NonNullable<
    PlayerProps<TElement, TPoster, TPlaybackPolicyObject>['autoUrlUpload']
  >;
  jwt: PlayerProps<TElement, TPoster, TPlaybackPolicyObject>['jwt'];
  screenWidth: InternalPlayerProps['_screenWidth'];
  playbackInfo: PlayerProps<
    TElement,
    TPoster,
    TPlaybackPolicyObject
  >['playbackInfo'];
  accessKey: PlayerProps<TElement, TPoster, TPlaybackPolicyObject>['accessKey'];
  onAccessKeyRequest: PlayerProps<
    TElement,
    TPoster,
    TPlaybackPolicyObject
  >['onAccessKeyRequest'];
};

type PlaybackUrlWithInfo = {
  url: string;
  screenWidthDelta: number | null;
};

const SCREEN_WIDTH_MULTIPLIER = 2.5;

export const useSourceMimeTyped = <
  TElement,
  TPoster,
  TPlaybackPolicyObject extends object,
>({
  src,
  playbackId,
  jwt,
  refetchPlaybackInfoInterval,
  autoUrlUpload = { fallback: true },
  playbackInfo,
  screenWidth,
  accessKey,
  onAccessKeyRequest,
}: UseSourceMimeTypedProps<TElement, TPoster, TPlaybackPolicyObject>) => {
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

  const resolvedPlaybackInfo = usePlaybackInfoOrImport({
    decentralizedSrcOrPlaybackId,
    playbackId,
    refetchPlaybackInfoInterval,
    autoUrlUpload,
    onAssetStatusChange,
  });

  const combinedPlaybackInfo = React.useMemo(
    () => playbackInfo ?? resolvedPlaybackInfo,
    [playbackInfo, resolvedPlaybackInfo],
  );

  const fetchAccessKey: () => Promise<string | null> =
    React.useCallback(async () => {
      if (accessKey) {
        return accessKey;
      }

      if (combinedPlaybackInfo?.meta?.playbackPolicy?.type === 'webhook') {
        const response = await onAccessKeyRequest?.(
          combinedPlaybackInfo.meta
            .playbackPolicy as WebhookPlaybackPolicy<TPlaybackPolicyObject>,
        );
        return response ?? null;
      }

      return null;
    }, [accessKey, onAccessKeyRequest, combinedPlaybackInfo]);

  const { data: accessKeyResolved } = useInternalQuery({
    queryKey: [combinedPlaybackInfo, onAccessKeyRequest, accessKey],
    queryFn: fetchAccessKey,
    enabled: Boolean(combinedPlaybackInfo || accessKey),
    staleTime: Infinity,
  });

  const [playbackUrls, setPlaybackUrls] = React.useState<PlaybackUrlWithInfo[]>(
    [],
  );

  React.useEffect(() => {
    const screenWidthWithDefault =
      (screenWidth ?? 1280) * SCREEN_WIDTH_MULTIPLIER;

    const playbackInfoSources: PlaybackUrlWithInfo[] | null =
      (playbackInfo ?? resolvedPlaybackInfo)?.meta?.source?.map((s) => ({
        url: s?.url,
        screenWidthDelta: s?.width
          ? Math.abs(screenWidthWithDefault - s.width)
          : s?.url.includes('static360p') || s?.url.includes('low-bitrate')
          ? Math.abs(screenWidthWithDefault - 480)
          : s?.url.includes('static720p')
          ? Math.abs(screenWidthWithDefault - 1280)
          : s?.url.includes('static1080p')
          ? Math.abs(screenWidthWithDefault - 1920)
          : s?.url.includes('static2160p')
          ? Math.abs(screenWidthWithDefault - 3840)
          : null,
      })) ?? null;

    if (playbackInfoSources) {
      setPlaybackUrls(playbackInfoSources);
    }
  }, [playbackInfo, resolvedPlaybackInfo, screenWidth]);

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

      // append the access key to the query params
      if (accessKeyResolved) {
        const url = new URL(source);
        url.searchParams.append('accessKey', accessKeyResolved);
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
  }, [playbackUrls, src, jwt, accessKeyResolved]);

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
      const previousSources = [...sourceMimeTyped] as (HlsSrc | VideoSrc)[];

      return previousSources.sort((a, b) => {
        if (a.type === 'video' && b.type === 'video') {
          const aOriginal = playbackUrls.find((u) => u.url === a.src);
          const bOriginal = playbackUrls.find((u) => u.url === b.src);

          // we sort the sources by the delta between the video width and the
          // screen size (multiplied by a multiplier above)
          return bOriginal?.screenWidthDelta && aOriginal?.screenWidthDelta
            ? aOriginal.screenWidthDelta - bOriginal.screenWidthDelta
            : 1;
        }

        return a.type === 'video' && b.type === 'hls' ? -1 : 1;
      });
    }

    return sourceMimeTyped;
  }, [sourceMimeTyped, dStoragePlaybackUrl, playbackUrls]);

  return {
    source: sourceMimeTypedSorted,
    uploadStatus,
  } as const;
};
