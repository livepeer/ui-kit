import {
  ControlsContainer,
  Player,
  Src,
  TimeDisplay,
  UsePlayerListReturn,
  Volume,
  usePlayerList,
} from '@livepeer/react-native';
import { useCallback, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, View } from 'react-native';
import { Polyline, Svg } from 'react-native-svg';

import { VideoEntry } from '../App';

export type VideoListProps = {
  videos: VideoEntry[];
};

const videoHeight = Dimensions.get('window').height - 200;

export const VideoList: React.FC<VideoListProps> = ({ videos }) => {
  const { listProps } = usePlayerList({
    data: videos,
    itemVisibleMinimumViewTime: 100,
    itemVisiblePercentThreshold: 60,
    itemPreload: 2,
  });

  return (
    <FlatList
      {...listProps}
      style={styles.videoList}
      snapToAlignment="start"
      decelerationRate="fast"
      snapToInterval={videoHeight}
      showsVerticalScrollIndicator
      renderItem={({ item, index }) => (
        <ListItem item={item} isFinal={index === videos.length - 1} />
      )}
    />
  );
};

const ListItem = ({
  item,
  isFinal,
}: {
  item: UsePlayerListReturn<VideoEntry>['listProps']['data'][number];
  isFinal: boolean;
}) => {
  const [sourceInformation, setSourceInformation] = useState('');

  const onSourceUpdated = useCallback((sources: Src[]) => {
    if (sources?.[0]?.mime) {
      setSourceInformation(`${sources?.[0]?.mime}`);
    }
  }, []);

  return (
    <View style={isFinal ? styles.lastVideoContainer : styles.videoContainer}>
      <Player
        {...item.playerProps}
        controls={{ autohide: 0 }}
        aspectRatio="4to5"
        playbackId={item.playbackId}
        autoPlay
        loop
        title={item.title}
        onSourceUpdated={onSourceUpdated}
      >
        <>
          <ControlsContainer showLoadingSpinner={false} />
          <View style={styles.topContainer}>
            <View>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{sourceInformation}</Text>
            </View>
            <Volume />
          </View>

          <View style={styles.bottomContainer}>
            <TimeDisplay />
            {!isFinal && (
              <Svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <Polyline points="6 9 12 15 18 9"></Polyline>
              </Svg>
            )}
          </View>
        </>
      </Player>
    </View>
  );
};

const backgroundColor = 'black';
const titleColor = 'white';

const styles = StyleSheet.create({
  bottomContainer: {
    alignContent: 'flex-end',
    bottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    left: 10,
    position: 'absolute',
    right: 10,
  },
  lastVideoContainer: {
    alignContent: 'center',
    backgroundColor,
    height: videoHeight, // Dimensions.get('window').height + 200,
    justifyContent: 'center',
  },
  subtitle: {
    color: titleColor,
    fontSize: 12,
    fontWeight: '400',
  },
  title: {
    color: titleColor,
    fontSize: 16,
    fontWeight: '700',
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    left: 10,
    position: 'absolute',
    right: 10,
    textAlign: 'center',
    top: 10,
  },
  videoContainer: {
    alignContent: 'center',
    backgroundColor,
    height: videoHeight,
    justifyContent: 'center',
  },
  videoList: {
    marginBottom: 180,
  },
});
