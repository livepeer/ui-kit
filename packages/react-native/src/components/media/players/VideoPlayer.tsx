import { ResizeMode, Video } from 'expo-av';
import { VideoSrc } from 'livepeer/media';

import { forwardRef, useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { HlsPlayerProps } from './HlsPlayer';
import { canPlayMediaNatively } from './canPlayMediaNatively';

export type VideoPlayerProps = Omit<HlsPlayerProps, 'src'> & {
  src: VideoSrc[] | null;
};

export const VideoPlayer = forwardRef<Video, VideoPlayerProps>(
  ({ src, autoPlay, loop, muted, objectFit }, ref) => {
    const filteredSources = useMemo(() => {
      return src?.filter((s) => s?.mime && canPlayMediaNatively(s));
    }, [src]);

    return (
      <Video
        source={{ uri: filteredSources?.[0]?.src ?? '' }}
        style={styles.videoWrapper}
        videoStyle={styles.video}
        isLooping={loop}
        resizeMode={
          objectFit === 'contain' ? ResizeMode.CONTAIN : ResizeMode.COVER
        }
        shouldPlay={autoPlay}
        ref={ref}
        isMuted={muted}
      />
    );
  },
);

VideoPlayer.displayName = 'VideoPlayer';

export const styles = StyleSheet.create({
  video: {
    height: '100%',
    width: '100%',
  },
  videoWrapper: {
    alignItems: 'center',
    bottom: 0,
    flex: 1,
    height: '100%',
    justifyContent: 'space-between',
    left: 0,
    position: 'absolute',
    right: 0,
    width: '100%',
  },
});
