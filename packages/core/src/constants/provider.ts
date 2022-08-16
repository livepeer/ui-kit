import { LivepeerProviderConfig, TranscodingProfile } from '../types';

export const defaultStudioApiKey = '182188f3-3ddf-4dc2-9889-79ecb17a26c9';

export const defaultTranscodingProfiles: Array<TranscodingProfile> = [
  {
    name: '720p',
    bitrate: 2000000,
    fps: 30,
    width: 1280,
    height: 720,
  },
  {
    name: '480p',
    bitrate: 1000000,
    fps: 30,
    width: 854,
    height: 480,
  },
  {
    name: '360p',
    bitrate: 500000,
    fps: 30,
    width: 640,
    height: 360,
  },
];

export type LivepeerProviderName = 'studio';

export const studio: LivepeerProviderConfig = {
  name: 'Livepeer Studio',
  baseUrl: 'https://livepeer.studio/api',
} as const;
