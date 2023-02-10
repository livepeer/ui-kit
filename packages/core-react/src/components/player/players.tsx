import { AudioSrc, ControlsOptions, HlsSrc, VideoSrc } from '@livepeer/core';

import { PlayerObjectFit, PlayerProps } from './Player';

export type VideoPlayerProps<TElement, TPoster> = {
  src: (HlsSrc | VideoSrc)[] | null;
  objectFit: PlayerObjectFit;
  width?: string | number;
  autoPlay?: boolean;
  loop?: boolean;
  title?: string;
  muted?: boolean;
  priority?: boolean;
  poster?: PlayerProps<TElement, TPoster>['poster'];
  jwt?: string;
  isCurrentlyShown?: PlayerProps<TElement, TPoster>['_isCurrentlyShown'];
  options?: ControlsOptions;
  onStreamStatusChange?: (isLive: boolean) => void;
  onMetricsError?: (error: Error) => void;
  onAccessControlError?: (error: Error) => void;
};

export type AudioPlayerProps<TElement, TPoster> = Omit<
  VideoPlayerProps<TElement, TPoster>,
  'src' | 'poster'
> & {
  src: AudioSrc[] | null;
};
