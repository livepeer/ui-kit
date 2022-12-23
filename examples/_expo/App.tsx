import {
  LivepeerConfig,
  Player,
  ThemeConfig,
  createReactClient,
  studioProvider,
} from '@livepeer/react-native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';

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
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Agent 327</Text>
        <Player
          objectFit="contain"
          title="Operation Barbershop"
          aspectRatio="16to9"
          playbackId="6d7el73r1y12chxr"
          mediaElementRef={async (ref) => {
            await ref?.setVolumeAsync(0.5);
          }}
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
