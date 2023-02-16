import {
  LivepeerConfig,
  ThemeConfig,
  createReactClient,
  studioProvider,
} from '@livepeer/react-native';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { VideoList } from './components/VideoList';
import { VideoUpload } from './components/VideoUpload';

const theme: ThemeConfig = {};

const livepeerClient = createReactClient({
  provider: studioProvider({
    apiKey: 'ADD_YOUR_API_KEY_HERE',
  }),
});

export type VideoEntry = {
  title: string;
  playbackId: string;
};

const defaultVideoEntries: VideoEntry[] = [
  {
    title: 'Waterfall',
    playbackId: '848fx66utvak90pf',
  },
  {
    title: 'Agent 327',
    playbackId: 'ba37ipc4gijy0bfo',
  },
  {
    title: 'Earth Spinning',
    playbackId: 'cc13p5jdxyyawul8',
  },
];

export default function App() {
  const [videos, setVideos] = useState<VideoEntry[]>(defaultVideoEntries);

  return (
    <LivepeerConfig theme={theme} client={livepeerClient}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <Text style={styles.header}>Livepeer Tiktok</Text>
        <VideoUpload
          onUpload={(video) => setVideos((prev) => [...prev, video])}
        />
        <View style={styles.divider} />
        <VideoList videos={videos} />
      </View>
    </LivepeerConfig>
  );
}

const textColor = 'white';
const dividerColor = '#404040';
const backgroundColor = 'black';

const styles = StyleSheet.create({
  container: {
    alignContent: 'center',
    backgroundColor,
    paddingTop: 70,
  },
  divider: {
    backgroundColor: dividerColor,
    height: 1,
    marginVertical: 10,
  },
  header: {
    color: textColor,
    fontSize: 30,
    fontWeight: '700',
    textAlign: 'center',
  },
});
