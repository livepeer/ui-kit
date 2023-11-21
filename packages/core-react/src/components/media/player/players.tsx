import {
  AudioSrc,
  Base64Src,
  ControlsOptions,
  HlsSrc,
  ObjectFit,
  PlaybackError,
  VideoSrc,
  WebRTCSrc,
} from '@livepeer/core';

import { PlayerProps } from './usePlayer';

export type VideoPlayerProps<
  TElement,
  TPoster,
  TPlaybackPolicyObject extends object,
  TSlice,
> = {
  src: (HlsSrc | VideoSrc | Base64Src | WebRTCSrc)[] | null;
  objectFit: ObjectFit;
  width?: string | number;
  autoPlay?: boolean;
  loop?: boolean;
  title?: string;
  muted?: boolean;
  priority?: boolean;
  poster?: PlayerProps<
    TElement,
    TPoster,
    TPlaybackPolicyObject,
    TSlice
  >['poster'];
  jwt?: string;
  isCurrentlyShown?: PlayerProps<
    TElement,
    TPoster,
    TPlaybackPolicyObject,
    TSlice
  >['_isCurrentlyShown'];
  options?: ControlsOptions;
  onPlaybackStatusUpdate?: PlayerProps<
    TElement,
    TPoster,
    TPlaybackPolicyObject,
    TSlice
  >['onPlaybackStatusUpdate'];
  playbackStatusSelector?: PlayerProps<
    TElement,
    TPoster,
    TPlaybackPolicyObject,
    TSlice
  >['playbackStatusSelector'];

  playbackError: PlaybackError | null;
  onPlaybackError: (error: Error | null) => void;
};

export type AudioPlayerProps<
  TElement,
  TPoster,
  TPlaybackPolicyObject extends object,
  TSlice,
> = Omit<
  VideoPlayerProps<TElement, TPoster, TPlaybackPolicyObject, TSlice>,
  'src' | 'poster'
> & {
  src: AudioSrc[] | null;
};
