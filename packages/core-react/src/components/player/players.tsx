import { AudioSrc, ControlsOptions, HlsSrc, VideoSrc } from 'livepeer';

import { PlayerObjectFit } from './Player';

export type HlsPlayerProps = {
  src: HlsSrc;
  objectFit: PlayerObjectFit;
  width?: string | number;
  autoPlay?: boolean;
  loop?: boolean;
  title?: string;
  muted?: boolean;
  poster?: string;
  jwt?: string;
  options?: ControlsOptions;
  onMetricsError?: (error: Error) => void;
};

export type AudioPlayerProps = Omit<HlsPlayerProps, 'src' | 'poster'> & {
  src: AudioSrc[];
};

export type VideoPlayerProps = Omit<HlsPlayerProps, 'src'> & {
  src: VideoSrc[] | null;
};
