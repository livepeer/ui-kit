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
  type: 'audio' | 'video' | 'hls' | 'webrtc';
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
export interface WebRTCSrc extends BaseSrc {
  type: 'webrtc';
  src: `${string}${OptionalQueryParams}`;
}
export type Src = AudioSrc | HlsSrc | VideoSrc | Base64Src | WebRTCSrc;

const audioExtensions =
  /\.(m4a|mp4a|mpga|mp2|mp2a|mp3|m2a|m3a|wav|weba|aac|oga|spx)($|\?)/i;
const videoExtensions = /\.(mp4|ogv|webm|mov|m4v|avi|m3u8)($|\?)/i;
const base64String = /data:video/i;
const hlsExtensions = /\.(m3u8)($|\?)/i;
const webrtcExtensions = /(webrtc|sdp)/i;
const mimeFromBase64Pattern = /data:(.+?);base64/;

export const getMediaSourceType = (
  src: string,
): HlsSrc | AudioSrc | VideoSrc | Base64Src | WebRTCSrc | null => {
  const base64Mime = src.match(mimeFromBase64Pattern);
  return webrtcExtensions.test(src)
    ? {
        type: 'webrtc',
        src: src as WebRTCSrc['src'],
        mime: 'video/vp8',
      }
    : hlsExtensions.test(src)
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
        src: src as Base64Src['src'],
        mime: base64Mime ? (base64Mime[1] as MimeType) : 'video/mp4',
      }
    : null;
};
