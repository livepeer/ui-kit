import {
  LivepeerConfig,
  Player,
  ThemeConfig,
  createReactClient,
  studioProvider,
  useCreateAsset,
} from '@livepeer/react-native';
import {
  ImagePickerAsset,
  MediaTypeOptions,
  launchImageLibraryAsync,
} from 'expo-image-picker';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

const theme: ThemeConfig = {
  colors: {
    accent: '#72DDF7',
    progressLeft: '#F7AEF8',
    progressMiddle: '#F7AEF8',
    progressRight: '#F7AEF8',
    progressThumb: '#F4F4ED',
  },
};

const livepeerClient = createReactClient({
  provider: studioProvider({
    baseUrl: 'https://livepeer.monster/api',
    apiKey: '13954d57-b34e-40be-98c7-22db6e4f144e',
  }),
});

export default function App() {
  return (
    <LivepeerConfig theme={theme} client={livepeerClient}>
      <StatusBar style="auto" />
      <View style={styles.player}>
        <VideoPlayer />
      </View>
    </LivepeerConfig>
  );
}

const VideoPlayer = () => {
  const [video, setVideo] = useState<ImagePickerAsset | null>(null);

  const pickImage = async () => {
    const result = await launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.Videos,
      allowsEditing: true,
    });

    if (result?.assets?.[0]) {
      setVideo(result?.assets?.[0]);
    }
  };

  const {
    mutate: createAsset,
    data: assets,
    progress,
    status,
    error,
  } = useCreateAsset(
    // we use a `const` assertion here to provide better Typescript types
    // for the returned data
    video
      ? {
          sources: [{ name: video.fileName ?? 'video', file: video }] as const,
        }
      : null,
  );

  useEffect(() => {
    if (status === 'success') {
      setVideo(null);
    }
  }, [status]);

  return (
    <>
      <Button
        title={!createAsset ? 'Pick a video from camera roll' : 'Begin upload'}
        onPress={!createAsset ? pickImage : createAsset}
        disabled={status === 'loading'}
      />
      {progress?.[0] && (
        <Text style={styles.text}>
          Upload: {progress?.[0]?.phase} -{' '}
          {(progress?.[0]?.progress * 100).toFixed()}%
        </Text>
      )}
      {error && <Text style={styles.text}>Error: {error.message}</Text>}
      {assets?.[0]?.playbackId && (
        <Player
          title={assets?.[0]?.name}
          aspectRatio="16to9"
          playbackId={assets?.[0]?.playbackId}
          autoPlay
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  player: {
    alignContent: 'center',
    marginTop: 70,
    textAlign: 'center',
  },
  text: {
    textAlign: 'center',
  },
});
