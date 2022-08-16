import { Box, Button, Flex, Text } from '@livepeer/design-system';
import { useAsset, useCreateAsset } from '@livepeer/react';

import { useCallback, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';

import { Spinner, VideoPlayer } from '../core';

const activeStyle = {
  borderColor: 'white',
};

const acceptStyle = {
  borderColor: '#5842c3',
};

const rejectStyle = {
  borderColor: 'red',
};

export const Asset = () => {
  const [video, setVideo] = useState<File | undefined>();
  const {
    mutate: createAsset,
    data: createdAsset,
    status: createStatus,
  } = useCreateAsset();
  const { data: asset, error } = useAsset({
    assetId: createdAsset?.id,
    refetchInterval: (asset) => (!asset?.playbackUrl ? 5000 : false),
  });

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0 && acceptedFiles?.[0]) {
      setVideo(acceptedFiles[0]);
    }
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept: {
      'video/*': ['*.mp4'],
    },
    maxFiles: 1,
    onDrop,
  });

  const style = useMemo(
    () => ({
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
      ...(isDragActive ? activeStyle : {}),
    }),
    [isDragActive, isDragReject, isDragAccept],
  );

  return (
    <Box css={{ my: '$6' }}>
      <Box
        css={{
          mb: '$3',
          width: '100%',
        }}
      >
        <Box
          as="div"
          css={{
            width: '100%',
            cursor: 'pointer',
            p: '$1',
            mb: '$0',
            height: 'auto',
            border: '1px solid $colors$primary7',
            borderRadius: '$1',
          }}
          {...getRootProps({ style })}
        >
          <Box as="input" {...getInputProps()} />
          <Box
            as="p"
            css={{
              width: '100%',
              height: '100%',
              border: '1px dotted $colors$primary7',
              borderRadius: '$1',
              m: 0,
              fontSize: '$3',
              p: '$3',
              transition: 'border .24s ease-in-out',
              minWidth: '296px',
              minHeight: '70px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text variant="gray">
              Drag and drop or{' '}
              <Box as="span" css={{ color: '$primary9', fontWeight: 700 }}>
                browse files
              </Box>
            </Text>
          </Box>
        </Box>

        {error?.message && (
          <Box>
            <Text variant="red">{error.message}</Text>
          </Box>
        )}
      </Box>

      <Text
        size="3"
        variant="gray"
        css={{ mt: '$1', fontSize: '$2', mb: '$4' }}
      >
        {!video ? 'Select a video file to upload' : video.name}
      </Text>

      <Flex css={{ jc: 'flex-end', gap: '$3', mt: '$4' }}>
        <Button
          type="submit"
          css={{ display: 'flex', ai: 'center' }}
          onClick={() => {
            if (video) {
              createAsset({ name: video.name, file: video });
            }
          }}
          size="2"
          disabled={!video || createStatus === 'loading' || Boolean(asset)}
          variant="primary"
        >
          Upload
        </Button>
      </Flex>

      {asset &&
        (!asset?.playbackUrl ? (
          <Flex css={{ my: '$3', justifyContent: 'center' }}>
            <Spinner />
          </Flex>
        ) : (
          <Box css={{ mt: '$2' }}>
            <VideoPlayer src={asset?.playbackUrl} />
          </Box>
        ))}
    </Box>
  );
};
