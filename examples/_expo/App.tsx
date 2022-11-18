import {
  LivepeerConfig,
  Player,
  createReactClient,
  studioProvider,
} from '@livepeer/react-native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const livepeerClient = createReactClient({
  provider: studioProvider({
    apiKey: process.env.NEXT_PUBLIC_STUDIO_API_KEY,
  }),
});

export default function App() {
  return (
    <LivepeerConfig client={livepeerClient}>
      <StatusBar style="auto" />
      <View style={styles.container}>
        <Text style={styles.title}>A Great Video</Text>
        <Player
          autoPlay
          muted
          objectFit="contain"
          title="Part Two"
          playbackId="bafybeida3w2w7fch2fy6rfvfttqamlcyxgd3ddbf4u25n7fxzvyvcaegxy"
        />
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
    paddingTop: 120,
  },
  title: {
    fontSize: 25,
    marginBottom: 12,
  },
});
