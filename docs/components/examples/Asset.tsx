import { Badge, Box, Button, Flex, Text } from '@livepeer/design-system';
import {
  Player,
  useAsset,
  useAssetMetrics,
  useCreateAsset,
} from '@livepeer/react';

import { useCallback, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';

import { Spinner } from '../core';

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
    uploadProgress,
  } = useCreateAsset();
  const {
    data: asset,
    error,
    status: assetStatus,
  } = useAsset({
    assetId: createdAsset?.id,
    refetchInterval: (asset) =>
      asset?.status?.phase !== 'ready' ? 5000 : false,
  });
  const { data: metrics } = useAssetMetrics({
    assetId: createdAsset?.id,
    refetchInterval: 30000,
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

  const isLoading = useMemo(
    () =>
      createStatus === 'loading' ||
      assetStatus === 'loading' ||
      (asset && asset?.status?.phase !== 'ready'),
    [createStatus, asset, assetStatus],
  );

  const progressFormatted = useMemo(
    () =>
      uploadProgress
        ? `Uploading: ${Math.round(uploadProgress * 100)}%`
        : asset?.status?.progress
        ? `Processing: ${Math.round(asset?.status?.progress * 100)}%`
        : null,
    [uploadProgress, asset?.status?.progress],
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

      <Flex css={{ gap: '$2', ai: 'center', mt: '$1', mb: '$4' }}>
        {video ? (
          <Badge size="2" variant="gray">
            {video.name}
          </Badge>
        ) : (
          <Text size="2" variant="gray">
            Select a video file to upload.
          </Text>
        )}
        {progressFormatted && <Text size="2">{progressFormatted}</Text>}
      </Flex>

      <Flex css={{ jc: 'flex-end', mt: '$4', ai: 'center' }}>
        <Button
          type="submit"
          css={{ display: 'flex', ai: 'center' }}
          onClick={() => {
            if (video) {
              createAsset({ name: video.name, file: video });
            }
          }}
          size="2"
          disabled={!video || isLoading || Boolean(asset)}
          variant="primary"
        >
          {isLoading && <Spinner size={16} css={{ mr: '$1' }} />}
          Upload
        </Button>
      </Flex>

      {asset?.playbackId && (
        <Box css={{ mt: '$2' }}>
          <Player playbackId={asset?.playbackId} />
        </Box>
      )}
      {metrics?.metrics?.[0] && (
        <Badge size="2" variant="gray">
          Views: {metrics?.metrics?.[0]?.startViews}
        </Badge>
      )}
    </Box>
  );
};
