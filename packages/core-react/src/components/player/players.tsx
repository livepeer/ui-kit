import {
  AudioSrc,
  Base64Src,
  ControlsOptions,
  HlsSrc,
  VideoSrc,
  WebRTCSrc,
} from '@livepeer/core';

import { PlayerObjectFit, PlayerProps } from './Player';

export type VideoPlayerProps<
  TElement,
  TPoster,
  TPlaybackPolicyObject extends object,
> = {
  src: (HlsSrc | VideoSrc | Base64Src | WebRTCSrc)[] | null;
  objectFit: PlayerObjectFit;
  width?: string | number;
  autoPlay?: boolean;
  loop?: boolean;
  title?: string;
  muted?: boolean;
  priority?: boolean;
  poster?: PlayerProps<TElement, TPoster, TPlaybackPolicyObject>['poster'];
  jwt?: string;
  isCurrentlyShown?: PlayerProps<
    TElement,
    TPoster,
    TPlaybackPolicyObject
  >['_isCurrentlyShown'];
  options?: ControlsOptions;
  onStreamStatusChange?: (isLive: boolean) => void;
  onMetricsError?: (error: Error) => void;
  onAccessControlError?: (error: Error | null) => void;
  onError?: (error: Error) => void;
};

export type AudioPlayerProps<
  TElement,
  TPoster,
  TPlaybackPolicyObject extends object,
> = Omit<
  VideoPlayerProps<TElement, TPoster, TPlaybackPolicyObject>,
  'src' | 'poster'
> & {
  src: AudioSrc[] | null;
};
