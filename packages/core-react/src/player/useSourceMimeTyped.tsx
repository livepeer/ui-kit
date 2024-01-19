// import {
//   AudioSrc,
//   Base64Src,
//   HlsSrc,
//   Src,
//   VideoSrc,
//   WebRTCSrc,
//   getMediaSourceType,
// } from "@livepeer/core";

// import * as React from "react";

// import { InternalPlayerProps, PlayerProps } from "./usePlayer";

// // const defaultIpfsGateway = 'https://w3s.link';
// // const defaultArweaveGateway = 'https://arweave.net';

// export type UseSourceMimeTypedProps<TElement, TPoster, TSlice> = {
//   refetchPlaybackInfoInterval: NonNullable<
//     PlayerProps<TElement, TPoster, TSlice>["refetchPlaybackInfoInterval"]
//   >;
//   jwt: PlayerProps<TElement, TPoster, TSlice>["jwt"];
//   screenWidth: InternalPlayerProps["_screenWidth"];
//   src: PlayerProps<TElement, TPoster, TSlice>["src"];
//   accessKey: PlayerProps<TElement, TPoster, TSlice>["accessKey"];
//   playRecording: PlayerProps<TElement, TPoster, TSlice>["playRecording"];
//   sessionToken: string;
// };

// type PlaybackUrlWithInfo = {
//   url: string;
//   screenWidthDelta: number | null;
//   isRecording?: true;
// };

// const SCREEN_WIDTH_MULTIPLIER = 2.5;

// export const useSourceMimeTyped = <TElement, TPoster, TSlice>({
//   jwt,
//   src,
//   screenWidth,
//   accessKey,
//   playRecording,
//   sessionToken,
// }: UseSourceMimeTypedProps<TElement, TPoster, TSlice>) => {
//   const playbackUrls = React.useMemo(() => {
//     const screenWidthWithDefault =
//       (screenWidth ?? 1280) * SCREEN_WIDTH_MULTIPLIER;

//     // const recordingPlaybackSources: PlaybackUrlWithInfo[] = playRecording && typeof src !== "string" && typeof src?.[0] === "string"
//     //   ? (
//     //       src?.meta as unknown as {
//     //         dvrPlayback: Source[];
//     //       }
//     //     )?.dvrPlayback?.map((s) => ({
//     //       url: s?.url,
//     //       screenWidthDelta: null,
//     //       isRecording: true,
//     //     })) ?? []
//     //   : [];

//     const source = typeof src === "string" ? [getMediaSourceType(src)] : src;

//     const playbackInfoSources: PlaybackUrlWithInfo[] =
//       source?.map((s) =>
//         typeof s === "string"
//           ? { url: s, screenWidthDelta: null }
//           : {
//               url: s?.url,
//               screenWidthDelta: s?.width
//                 ? Math.abs(screenWidthWithDefault - s.width)
//                 : s?.url.includes("static360p") ||
//                     s?.url.includes("low-bitrate")
//                   ? Math.abs(screenWidthWithDefault - 480)
//                   : s?.url.includes("static720p")
//                     ? Math.abs(screenWidthWithDefault - 1280)
//                     : s?.url.includes("static1080p")
//                       ? Math.abs(screenWidthWithDefault - 1920)
//                       : s?.url.includes("static2160p")
//                         ? Math.abs(screenWidthWithDefault - 3840)
//                         : null,
//             },
//       ) ?? [];

//     const _temp = playRecording;

//     const combinedPlaybackSources = [
//       // ...recordingPlaybackSources,
//       ...playbackInfoSources,
//     ];

//     return combinedPlaybackSources;
//   }, [src, screenWidth, playRecording]);

//   // const dStoragePlaybackUrl = React.useMemo(() => {
//   //   // if the player is auto uploading, we do not play back the detected input file unless specified
//   //   // e.g. https://arweave.net/84KylA52FVGLxyvLADn1Pm8Q3kt8JJM74B87MeoBt2w/400019.mp4
//   //   if (decentralizedSrcOrPlaybackId && autoUrlUpload) {
//   //     const urlUploadWithFallback =
//   //       typeof autoUrlUpload !== 'boolean'
//   //         ? {
//   //             arweaveGateway:
//   //               autoUrlUpload.arweaveGateway ?? defaultArweaveGateway,
//   //             ipfsGateway: autoUrlUpload.ipfsGateway ?? defaultIpfsGateway,
//   //           }
//   //         : {
//   //             arweaveGateway: defaultArweaveGateway,
//   //             ipfsGateway: defaultIpfsGateway,
//   //           };

//   //     if (decentralizedSrcOrPlaybackId.url.startsWith('ar://')) {
//   //       const { host } = new URL(urlUploadWithFallback.arweaveGateway);

//   //       const src: VideoSrc = {
//   //         type: 'video',
//   //         mime: 'video/mp4',
//   //         src: `https://${host}/${decentralizedSrcOrPlaybackId.id}` as VideoSrc['src'],
//   //       };

//   //       return src;
//   //     }
//   //     if (decentralizedSrcOrPlaybackId.url.startsWith('ipfs://')) {
//   //       const { host } = new URL(urlUploadWithFallback.ipfsGateway);

//   //       const src: VideoSrc = {
//   //         type: 'video',
//   //         mime: 'video/mp4',
//   //         src: `https://${host}/ipfs/${decentralizedSrcOrPlaybackId.id}` as VideoSrc['src'],
//   //       };

//   //       return src;
//   //     }

//   //     const srcBase64: Base64Src = {
//   //       type: 'video',
//   //       mime: 'video/mp4',
//   //       src: src as Base64Src['src'],
//   //     };
//   //     return srcBase64;
//   //   }

//   //   return null;
//   // }, [autoUrlUpload, decentralizedSrcOrPlaybackId, src]);

//   const [type, sourceMimeTyped] = React.useMemo(() => {
//     const defaultValue = ["none", null] as const;

//     // cast all URLs to an array of strings
//     const sources = playRecording
//       ? playbackUrls.filter((p) => p.isRecording).map((p) => p.url)
//       : playbackUrls.map((p) => p.url);

//     if (sources.length === 0) {
//       return defaultValue;
//     }

//     const mediaSourceTypes = sources
//       .map((s) => (typeof s === "string" ? getMediaSourceType(s) : null))
//       .filter((s) => s) as Src[];

//     const authenticatedSources = mediaSourceTypes.map((source) => {
//       const url = new URL(source.src);

//       // // append the tkn to the query params
//       // if (sessionToken) {
//       //   url.searchParams.append("tkn", sessionToken);
//       // }

//       // // we use headers for HLS and WebRTC for auth
//       // if (source.type === "hls" || source.type === "webrtc") {
//       //   return {
//       //     ...source,
//       //     src: url.toString(),
//       //   };
//       // }

//       // // append the JWT to the query params
//       // if (jwt && source) {
//       //   url.searchParams.append("jwt", jwt);
//       //   return {
//       //     ...source,
//       //     src: url.toString(),
//       //   };
//       // }

//       // // append the access key to the query params
//       // if (accessKey && source) {
//       //   url.searchParams.append("accessKey", accessKey);
//       //   return {
//       //     ...source,
//       //     src: url.toString(),
//       //   };
//       // }

//       // return {
//       //   ...source,
//       //   src: url.toString(),
//       // };
//     });

//     // we filter by either audio or video/hls
//     // return authenticatedSources?.[0]?.type === "audio"
//     //   ? ([
//     //       "audio",
//     //       authenticatedSources.filter((s) => s.type === "audio") as AudioSrc[],
//     //     ] as const)
//     //   : authenticatedSources?.[0]?.type === "video" ||
//     //       authenticatedSources?.[0]?.type === "hls" ||
//     //       authenticatedSources?.[0]?.type === "webrtc"
//     //     ? ([
//     //         "video",
//     //         authenticatedSources.filter(
//     //           (s) =>
//     //             s.type === "video" || s.type === "hls" || s.type === "webrtc",
//     //         ) as (VideoSrc | HlsSrc | WebRTCSrc)[],
//     //       ] as const)
//     //     : defaultValue;
//   }, [accessKey, jwt, playRecording, playbackUrls, sessionToken]);

//   const sourceMimeTypedSorted = React.useMemo(() => {
//     // if there is no source mime type and the Player has dstorage fallback enabled,
//     // we attempt to play from the dstorage URL directly
//     // if (!sourceMimeTyped && dStoragePlaybackUrl) {
//     //   return [dStoragePlaybackUrl];
//     // }

//     if (type === "video") {
//       const previousSources = [...sourceMimeTyped] as (
//         | Base64Src
//         | HlsSrc
//         | VideoSrc
//         | WebRTCSrc
//       )[];

//       return previousSources.sort((a, b) => {
//         if (a.type === "video" && b.type === "video") {
//           const aOriginal = playbackUrls.find((u) => u.url === a.src);
//           const bOriginal = playbackUrls.find((u) => u.url === b.src);

//           // we sort the sources by the delta between the video width and the
//           // screen size (multiplied by a multiplier above)
//           return bOriginal?.screenWidthDelta && aOriginal?.screenWidthDelta
//             ? aOriginal.screenWidthDelta - bOriginal.screenWidthDelta
//             : 1;
//         }
//         if (a.type === "video" && (b.type === "hls" || b.type === "webrtc")) {
//           // if the type is an MP4, we prefer that to HLS/WebRTC due to better caching/less overhead
//           return -1;
//         }
//         if (a.type === "webrtc" && b.type === "hls") {
//           // if there is a webrtc source, we prefer that to HLS
//           return -1;
//         }

//         return 1;
//       });
//     }

//     return sourceMimeTyped;
//   }, [sourceMimeTyped, type, playbackUrls]);

//   return sourceMimeTypedSorted;
// };
