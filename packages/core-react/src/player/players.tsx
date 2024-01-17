import {
  AudioSrc,
  Base64Src,
  ControlsOptions,
  HlsSrc,
  ObjectFit,
  PlaybackError,
  VideoSrc,
  WebRTCSrc,
} from "@livepeer/core";

import { PlayerProps } from "./usePlayer";

export type VideoPlayerProps<TElement, TPoster, TSlice> = {
  src: (HlsSrc | VideoSrc | Base64Src | WebRTCSrc)[] | null;
  objectFit: ObjectFit;
  width?: string | number;
  autoPlay?: boolean;
  loop?: boolean;
  title?: string;
  muted?: boolean;
  priority?: boolean;
  poster?: PlayerProps<TElement, TPoster, TSlice>["poster"];
  jwt?: string;
  accessKey?: string | null;
  isCurrentlyShown?: PlayerProps<
    TElement,
    TPoster,
    TSlice
  >["_isCurrentlyShown"];
  options?: ControlsOptions;
  onPlaybackStatusUpdate?: PlayerProps<
    TElement,
    TPoster,
    TSlice
  >["onPlaybackStatusUpdate"];
  playbackStatusSelector?: PlayerProps<
    TElement,
    TPoster,
    TSlice
  >["playbackStatusSelector"];

  playbackError: PlaybackError | null;
  onPlaybackError: (error: Error | null) => void;
};

export type AudioPlayerProps<TElement, TPoster, TSlice> = Omit<
  VideoPlayerProps<TElement, TPoster, TSlice>,
  "src" | "poster"
> & {
  src: AudioSrc[] | null;
};
