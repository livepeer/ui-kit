import {
  AudioSrc,
  Base64Src,
  HlsSrc,
  Src,
  VideoSrc,
  WebRTCSrc,
  getMediaSourceType,
} from '@livepeer/core';
import {
  CreateAssetUrlProgress,
  WebhookPlaybackPolicy,
} from '@livepeer/core/types';
import { parseArweaveTxId, parseCid } from '@livepeer/core/utils';
import * as React from 'react';

import { usePlaybackInfoOrImport } from './usePlaybackInfoOrImport';
import { InternalPlayerProps, PlayerProps } from './usePlayer';
import { useInternalQuery } from '../../../utils';

const defaultIpfsGateway = 'https://w3s.link';
const defaultArweaveGateway = 'https://arweave.net';

export type UseSourceMimeTypedProps<
  TElement,
  TPoster,
  TPlaybackPolicyObject extends object,
  TSlice,
> = {
  src: PlayerProps<TElement, TPoster, TPlaybackPolicyObject, TSlice>['src'];
  playbackId: PlayerProps<
    TElement,
    TPoster,
    TPlaybackPolicyObject,
    TSlice
  >['playbackId'];
  refetchPlaybackInfoInterval: NonNullable<
    PlayerProps<
      TElement,
      TPoster,
      TPlaybackPolicyObject,
      TSlice
    >['refetchPlaybackInfoInterval']
  >;
  autoUrlUpload: NonNullable<
    PlayerProps<
      TElement,
      TPoster,
      TPlaybackPolicyObject,
      TSlice
    >['autoUrlUpload']
  >;
  jwt: PlayerProps<TElement, TPoster, TPlaybackPolicyObject, TSlice>['jwt'];
  screenWidth: InternalPlayerProps['_screenWidth'];
  playbackInfo: PlayerProps<
    TElement,
    TPoster,
    TPlaybackPolicyObject,
    TSlice
  >['playbackInfo'];
  accessKey: PlayerProps<
    TElement,
    TPoster,
    TPlaybackPolicyObject,
    TSlice
  >['accessKey'];
  onAccessKeyRequest: PlayerProps<
    TElement,
    TPoster,
    TPlaybackPolicyObject,
    TSlice
  >['onAccessKeyRequest'];
  playRecording: PlayerProps<
    TElement,
    TPoster,
    TPlaybackPolicyObject,
    TSlice
  >['playRecording'];
  sessionToken: string;
};

type PlaybackUrlWithInfo = {
  url: string;
  screenWidthDelta: number | null;
  isRecording?: true;
};

const SCREEN_WIDTH_MULTIPLIER = 2.5;

export const useSourceMimeTyped = <
  TElement,
  TPoster,
  TPlaybackPolicyObject extends object,
  TSlice,
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
  playRecording,
  sessionToken,
}: UseSourceMimeTypedProps<
  TElement,
  TPoster,
  TPlaybackPolicyObject,
  TSlice
>) => {
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
    playRecording,
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

    const recordingPlaybackSources: PlaybackUrlWithInfo[] = playRecording
      ? (playbackInfo ?? resolvedPlaybackInfo)?.meta?.dvrPlayback?.map((s) => ({
          url: s?.url,
          screenWidthDelta: null,
          isRecording: true,
        })) ?? []
      : [];

    const playbackInfoSources: PlaybackUrlWithInfo[] =
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
      })) ?? [];

    const combinedPlaybackSources = [
      ...recordingPlaybackSources,
      ...playbackInfoSources,
    ];

    if (combinedPlaybackSources.length) {
      setPlaybackUrls(combinedPlaybackSources);
    }
  }, [playbackInfo, resolvedPlaybackInfo, screenWidth, playRecording]);

  const dStoragePlaybackUrl = React.useMemo(() => {
    // if the player is auto uploading, we do not play back the detected input file unless specified
    // e.g. https://arweave.net/84KylA52FVGLxyvLADn1Pm8Q3kt8JJM74B87MeoBt2w/400019.mp4
    if (decentralizedSrcOrPlaybackId && autoUrlUpload) {
      const urlUploadWithFallback =
        typeof autoUrlUpload !== 'boolean'
          ? {
              arweaveGateway:
                autoUrlUpload.arweaveGateway ?? defaultArweaveGateway,
              ipfsGateway: autoUrlUpload.ipfsGateway ?? defaultIpfsGateway,
            }
          : {
              arweaveGateway: defaultArweaveGateway,
              ipfsGateway: defaultIpfsGateway,
            };

      if (decentralizedSrcOrPlaybackId.url.startsWith('ar://')) {
        const { host } = new URL(urlUploadWithFallback.arweaveGateway);

        const src: VideoSrc = {
          type: 'video',
          mime: 'video/mp4',
          src: `https://${host}/${decentralizedSrcOrPlaybackId.id}` as VideoSrc['src'],
        };

        return src;
      } else if (decentralizedSrcOrPlaybackId.url.startsWith('ipfs://')) {
        const { host } = new URL(urlUploadWithFallback.ipfsGateway);

        const src: VideoSrc = {
          type: 'video',
          mime: 'video/mp4',
          src: `https://${host}/ipfs/${decentralizedSrcOrPlaybackId.id}` as VideoSrc['src'],
        };

        return src;
      } else {
        const srcBase64: Base64Src = {
          type: 'video',
          mime: 'video/mp4',
          src: src as Base64Src['src'],
        };
        return srcBase64;
      }
    }

    return null;
  }, [autoUrlUpload, decentralizedSrcOrPlaybackId, src]);

  const [type, sourceMimeTyped] = React.useMemo(() => {
    const defaultValue = ['none', null] as const;

    // cast all URLs to an array of strings
    const sources =
      playbackUrls.length > 0
        ? playRecording
          ? playbackUrls.filter((p) => p.isRecording).map((p) => p.url)
          : playbackUrls.map((p) => p.url)
        : typeof src === 'string'
        ? [src]
        : src;

    if (!sources) {
      return defaultValue;
    }

    const mediaSourceTypes = sources
      .map((s) => (typeof s === 'string' ? getMediaSourceType(s) : null))
      .filter((s) => s) as Src[];

    const authenticatedSources = mediaSourceTypes.map((source) => {
      const url = new URL(source.src);

      // append the tkn to the query params
      if (sessionToken) {
        url.searchParams.append('tkn', sessionToken);
      }

      // we use headers for HLS and WebRTC for auth
      if (source.type === 'hls' || source.type === 'webrtc') {
        return {
          ...source,
          src: url.toString(),
        };
      }

      // append the JWT to the query params
      if (jwt && source) {
        url.searchParams.append('jwt', jwt);
        return {
          ...source,
          src: url.toString(),
        };
      }

      // append the access key to the query params
      if (accessKeyResolved && source) {
        url.searchParams.append('accessKey', accessKeyResolved);
        return {
          ...source,
          src: url.toString(),
        };
      }

      return {
        ...source,
        src: url.toString(),
      };
    });

    // we filter by either audio or video/hls
    return authenticatedSources?.[0]?.type === 'audio'
      ? ([
          'audio',
          authenticatedSources.filter((s) => s.type === 'audio') as AudioSrc[],
        ] as const)
      : authenticatedSources?.[0]?.type === 'video' ||
        authenticatedSources?.[0]?.type === 'hls' ||
        authenticatedSources?.[0]?.type === 'webrtc'
      ? ([
          'video',
          authenticatedSources.filter(
            (s) =>
              s.type === 'video' || s.type === 'hls' || s.type === 'webrtc',
          ) as (VideoSrc | HlsSrc | WebRTCSrc)[],
        ] as const)
      : defaultValue;
  }, [playbackUrls, src, playRecording]);

  const sourceMimeTypedSorted = React.useMemo(() => {
    // if there is no source mime type and the Player has dstorage fallback enabled,
    // we attempt to play from the dstorage URL directly
    if (!sourceMimeTyped && dStoragePlaybackUrl) {
      return [dStoragePlaybackUrl];
    }

    if (type === 'video') {
      const previousSources = [...sourceMimeTyped] as (
        | Base64Src
        | HlsSrc
        | VideoSrc
        | WebRTCSrc
      )[];

      return previousSources.sort((a, b) => {
        if (a.type === 'video' && b.type === 'video') {
          const aOriginal = playbackUrls.find((u) => u.url === a.src);
          const bOriginal = playbackUrls.find((u) => u.url === b.src);

          // we sort the sources by the delta between the video width and the
          // screen size (multiplied by a multiplier above)
          return bOriginal?.screenWidthDelta && aOriginal?.screenWidthDelta
            ? aOriginal.screenWidthDelta - bOriginal.screenWidthDelta
            : 1;
        } else if (
          a.type === 'video' &&
          (b.type === 'hls' || b.type === 'webrtc')
        ) {
          // if the type is an MP4, we prefer that to HLS/WebRTC due to better caching/less overhead
          return -1;
        } else if (a.type === 'webrtc' && b.type === 'hls') {
          // if there is a webrtc source, we prefer that to HLS
          return -1;
        }

        return 1;
      });
    }

    return sourceMimeTyped;
  }, [sourceMimeTyped, type, dStoragePlaybackUrl, playbackUrls]);

  return {
    source: sourceMimeTypedSorted,
    uploadStatus,
    accessKeyResolved,
    jwtResolved: jwt,
  } as const;
};
