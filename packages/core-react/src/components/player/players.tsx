import { AudioSrc, ControlsOptions, HlsSrc, VideoSrc } from 'livepeer';

import { PlayerObjectFit, PlayerProps } from './Player';

export type HlsPlayerProps<TPoster> = {
  src: HlsSrc;
  objectFit: PlayerObjectFit;
  width?: string | number;
  autoPlay?: boolean;
  loop?: boolean;
  title?: string;
  muted?: boolean;
  poster?: PlayerProps<TPoster>['poster'];
  jwt?: string;
  options?: ControlsOptions;
  onMetricsError?: (error: Error) => void;
};

export type AudioPlayerProps<TPoster> = Omit<
  HlsPlayerProps<TPoster>,
  'src' | 'poster'
> & {
  src: AudioSrc[];
};

export type VideoPlayerProps<TPoster> = Omit<HlsPlayerProps<TPoster>, 'src'> & {
  src: VideoSrc[] | null;
};
