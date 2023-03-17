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

export interface Base64Src extends BaseSrc {
  type: 'video';
  src: `${string}`;
}
export interface HlsSrc extends BaseSrc {
  type: 'hls';
  src: `${string}${HlsExtension}${OptionalQueryParams}`;
}
export type Src = AudioSrc | HlsSrc | VideoSrc | Base64Src;

const audioExtensions =
  /\.(m4a|mp4a|mpga|mp2|mp2a|mp3|m2a|m3a|wav|weba|aac|oga|spx)($|\?)/i;
const videoExtensions = /\.(mp4|ogv|webm|mov|m4v|avi|m3u8)($|\?)/i;
const base64String = /data:video/;
const hlsExtensions = /\.(m3u8)($|\?)/i;
const mimeFromBase64 = /data:(.+?);base64/;

export const getMediaSourceType = (
  src: string,
): HlsSrc | AudioSrc | VideoSrc | Base64Src | null => {
  const base64Mime = src.match(mimeFromBase64);
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
    : base64String.test(src)
    ? {
        type: 'video',
        src: src,
        mime: base64Mime ? (base64Mime[1] as MimeType) : 'video/mp4',
      }
    : null;
};
