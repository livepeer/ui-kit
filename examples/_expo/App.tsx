import {
  LivepeerConfig,
  Player,
  ThemeConfig,
  createReactClient,
  studioProvider,
} from '@livepeer/react-native';
import { Video } from 'expo-av';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';

const theme: ThemeConfig = {
  colors: {
    accent: '#00a55f',
  },
};

const livepeerClient = createReactClient({
  provider: studioProvider({
    apiKey: process.env.NEXT_PUBLIC_STUDIO_API_KEY ?? '',
  }),
});

export default function App() {
  const mediaElementRef = useCallback(async (ref: Video) => {
    await ref.setVolumeAsync(0.5);
  }, []);

  return (
    <LivepeerConfig theme={theme} client={livepeerClient}>
      <StatusBar style="auto" />
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Agent 327</Text>
        <Player
          objectFit="contain"
          title="Operation Barbershop"
          aspectRatio="16to9"
          playbackId="6d7el73r1y12chxr"
          mediaElementRef={mediaElementRef}
        />
      </ScrollView>
    </LivepeerConfig>
  );
}

const white = '#fff';

const styles = StyleSheet.create({
  container: {
    // alignItems: 'center',
    backgroundColor: white,
    flex: 1,
    marginHorizontal: 8,
    marginTop: 70,
  },
  title: {
    fontSize: 25,
    marginBottom: 12,
  },
});
