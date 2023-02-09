import {
  ControlsContainer,
  Player,
  TimeDisplay,
  Volume,
  usePlayerList,
} from '@livepeer/react-native';
import { Dimensions, FlatList, StyleSheet, Text, View } from 'react-native';
import { Polyline, Svg } from 'react-native-svg';

import { VideoEntry } from '../App';

export type VideoListProps = {
  videos: VideoEntry[];
};

const videoHeight = Dimensions.get('window').height - 200;

export const VideoList: React.FC<VideoListProps> = ({ videos }) => {
  const { listProps } = usePlayerList({ data: videos, itemPreload: 2 });

  return (
    <FlatList
      {...listProps}
      style={styles.videoList}
      snapToAlignment="start"
      decelerationRate="fast"
      snapToInterval={videoHeight}
      showsVerticalScrollIndicator
      renderItem={({ item, index }) => (
        <View
          style={
            index !== videos.length - 1
              ? styles.videoContainer
              : styles.lastVideoContainer
          }
        >
          <Player
            {...item.playerProps}
            controls={{ autohide: 0 }}
            aspectRatio="4to5"
            playbackId={item.playbackId}
            autoPlay
            loop
            title={item.title}
            showLoadingSpinner={false}
          >
            <>
              <ControlsContainer />
              <View style={styles.topContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Volume />
              </View>

              <View style={styles.timeContainer}>
                <TimeDisplay />
              </View>

              <View style={styles.nextVideoContainer}>
                {index !== videos.length - 1 && (
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
      )}
    />
  );
};

const backgroundColor = 'black';
const titleColor = 'white';

const styles = StyleSheet.create({
  lastVideoContainer: {
    alignContent: 'center',
    backgroundColor,
    height: videoHeight, // Dimensions.get('window').height + 200,
    justifyContent: 'center',
  },
  nextVideoContainer: {
    bottom: 10,
    position: 'absolute',
    right: 10,
  },
  timeContainer: {
    bottom: 10,
    left: 10,
    position: 'absolute',
  },
  title: {
    alignSelf: 'center',
    color: titleColor,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
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
