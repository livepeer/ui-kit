import { AudioPlayerProps } from '@livepeer/core-react/components';
import { Video } from 'expo-av';
import * as React from 'react';
import { Text } from 'react-native';

export type { AudioPlayerProps };

export const AudioPlayer = React.forwardRef<Video, AudioPlayerProps>(() => {
  return <Text>Not implemented yet.</Text>;
});

AudioPlayer.displayName = 'AudioPlayer';
