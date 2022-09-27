import { StudioLivepeerProviderConfig } from '../providers/studio';
import { TranscodingProfile } from '../types';

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

const _studioConfigConst = {
  name: 'Livepeer Studio',
  baseUrl: 'https://livepeer.studio/api',
  apiKey: 'a616be3b-8980-4932-8079-0122e0106f95',
} as const;

export type StudioLivepeerProviderName = typeof _studioConfigConst.name;

export const defaultStudioConfig =
  _studioConfigConst as StudioLivepeerProviderConfig;
