import { useCreateAsset } from '@livepeer/react-native';
import {
  ImagePickerAsset,
  MediaTypeOptions,
  launchImageLibraryAsync,
} from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text } from 'react-native';

import { VideoEntry } from '../App';

export type VideoUploadProps = {
  onUpload: (video: VideoEntry) => void;
};

export const VideoUpload: React.FC<VideoUploadProps> = ({ onUpload }) => {
  const [video, setVideo] = useState<ImagePickerAsset | null>(null);

  const pickImage = async () => {
    const result = await launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.Videos,
      allowsEditing: true,
    });

    const newVideo = result?.assets?.[0];

    if (newVideo) {
      setVideo(newVideo);
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
          sources: [
            { name: video.fileName ?? 'Cool Video', file: video },
          ] as const,
        }
      : null,
  );

  useEffect(() => {
    if (assets?.[0]?.playbackId) {
      onUpload({
        title: assets[0].name,
        playbackId: assets[0].playbackId,
      });
      setVideo(null);
    }
  }, [status, assets, onUpload]);

  return (
    <>
      {progress?.[0] && status === 'loading' ? (
        <Text style={styles.text}>
          Upload: {progress?.[0]?.phase} -{' '}
          {(progress?.[0]?.progress * 100).toFixed()}%
        </Text>
      ) : (
        <Button
          title={
            !createAsset ? 'Upload a video from camera roll' : 'Begin upload'
          }
          color="green"
          onPress={!createAsset ? pickImage : createAsset}
          disabled={status === 'loading'}
        />
      )}

      {error && <Text style={styles.text}>Error: {error.message}</Text>}
    </>
  );
};

const textColor = 'green';

const styles = StyleSheet.create({
  text: {
    color: textColor,
    textAlign: 'center',
  },
});
