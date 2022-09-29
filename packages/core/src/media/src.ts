import { MimeType, getMimeType } from './mime';

type AudioExtension =
  | 'm4a'
  | 'mp4a'
  | 'mpga'
  | 'mp2'
  | 'mp2a'
  | 'mp3'
  | 'm2a'
  | 'm3a'
  | 'wav'
  | 'weba'
  | 'aac'
  | 'oga'
  | 'spx';
type VideoExtension = 'mp4' | 'ogv' | 'webm' | 'mov' | 'm4v' | 'avi' | 'm3u8';
type HlsExtension = 'm3u8';

type OptionalQueryParams = `?${string}` | '';

type BaseSrc = {
  type: 'audio' | 'video' | 'hls';
  src: string;
  mime: MimeType | null;
};
export interface AudioSrc extends BaseSrc {
  type: 'audio';
  src: `${string}${AudioExtension}${OptionalQueryParams}`;
}
export interface VideoSrc extends BaseSrc {
  type: 'video';
  src: `${string}${VideoExtension}${OptionalQueryParams}`;
}
export interface HlsSrc extends BaseSrc {
  type: 'hls';
  src: `${string}${HlsExtension}${OptionalQueryParams}`;
}
export type Src = AudioSrc | HlsSrc | VideoSrc;

const audioExtensions =
  /\.(m4a|mp4a|mpga|mp2|mp2a|mp3|m2a|m3a|wav|weba|aac|oga|spx)($|\?)/i;
const videoExtensions = /\.(mp4|ogv|webm|mov|m4v|avi|m3u8)($|\?)/i;
const hlsExtensions = /\.(m3u8)($|\?)/i;

export const getMediaSourceType = (
  src: string,
): HlsSrc | AudioSrc | VideoSrc | null => {
  return hlsExtensions.test(src)
    ? {
        type: 'hls',
        src: src as HlsSrc['src'],
        mime: getMimeType(hlsExtensions.exec(src)?.[1] ?? ''),
      }
    : videoExtensions.test(src)
    ? {
        type: 'video',
        src: src as VideoSrc['src'],
        mime: getMimeType(videoExtensions.exec(src)?.[1] ?? ''),
      }
    : audioExtensions.test(src)
    ? {
        type: 'audio',
        src: src as AudioSrc['src'],
        mime: getMimeType(audioExtensions.exec(src)?.[1] ?? ''),
      }
    : null;
};

// Taken from video.js
// const _hlsTypes = new Set([
//   // Apple sanctioned
//   'application/vnd.apple.mpegurl',
//   // Apple sanctioned for backwards compatibility
//   'audio/mpegurl',
//   // Very common
//   'audio/x-mpegurl',
//   // Very common
//   'application/x-mpegurl',
//   // Included for completeness
//   'video/x-mpegurl',
//   'video/mpegurl',
//   'application/mpegurl',
// ]);
