import { Video } from 'expo-av';
import { AudioSrc } from 'livepeer/media';
import * as React from 'react';
import { Text } from 'react-native';

import { HlsPlayerProps } from './HlsPlayer';

export type AudioPlayerProps = Omit<HlsPlayerProps, 'src' | 'poster'> & {
  src: AudioSrc[];
};

export const AudioPlayer = React.forwardRef<Video, AudioPlayerProps>(() => {
  return <Text>Not implemented yet.</Text>;
});

AudioPlayer.displayName = 'AudioPlayer';
