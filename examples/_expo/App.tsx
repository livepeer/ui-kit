import {
  LivepeerConfig,
  Player,
  createReactClient,
  studioProvider,
} from '@livepeer/react-native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const livepeerClient = createReactClient({
  provider: studioProvider({
    apiKey: process.env.NEXT_PUBLIC_STUDIO_API_KEY,
  }),
});

export default function App() {
  return (
    <LivepeerConfig client={livepeerClient}>
      <View style={styles.container}>
        <Player
          autoPlay
          muted
          playbackId="bafybeida3w2w7fch2fy6rfvfttqamlcyxgd3ddbf4u25n7fxzvyvcaegxy"
        />
        <StatusBar style="auto" />
      </View>
    </LivepeerConfig>
  );
}

const white = '#fff';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: white,
    flex: 1,
    justifyContent: 'center',
  },
});
