import {
  LivepeerConfig,
  Player,
  ThemeConfig,
  createReactClient,
  studioProvider,
} from '@livepeer/react-native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View } from 'react-native';

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
    apiKey: process.env.NEXT_PUBLIC_STUDIO_API_KEY ?? '',
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
  return (
    <>
      <Player
        aspectRatio="16to9"
        // src="https://livepeercdn.studio/recordings/2155e493-e63a-4379-b1ee-8aa8d7ac2983/index.m3u8"
        playbackId="52725sw6ofw5wbzh"
        autoPlay
        loop
      />
    </>
  );
};

const styles = StyleSheet.create({
  player: {
    alignContent: 'center',
    marginTop: 70,
    textAlign: 'center',
  },
});
