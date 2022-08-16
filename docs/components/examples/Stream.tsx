import { Box, Button, Flex, Text, TextField } from '@livepeer/design-system';
import { useCreateStream, useStream } from '@livepeer/react';

import { useState } from 'react';

import { Spinner, VideoPlayer } from '../core';

export const Stream = () => {
  const [streamName, setStreamName] = useState<string>('');
  const {
    mutate: createStream,
    data: createdStream,
    status: createStatus,
  } = useCreateStream();
  const { data: stream } = useStream({
    streamId: createdStream?.id,
    refetchInterval: (stream) => (!stream?.isActive ? 5000 : false),
  });

  return (
    <Box css={{ my: '$6' }}>
      <Box
        css={{
          mb: '$3',
          width: '100%',
        }}
      >
        <TextField
          size="3"
          type="text"
          placeholder="Stream name"
          onChange={(e) => setStreamName(e.target.value)}
        />
      </Box>

      <Flex css={{ jc: 'flex-end', gap: '$3', mt: '$4' }}>
        <Button
          css={{ display: 'flex', ai: 'center' }}
          onClick={() => {
            if (streamName) {
              createStream({ name: streamName });
            }
          }}
          size="2"
          disabled={
            !streamName || createStatus === 'loading' || Boolean(stream)
          }
          variant="primary"
        >
          Create Stream
        </Button>
      </Flex>

      {stream &&
        stream.streamKey &&
        (!stream?.playbackUrl || !stream.isActive ? (
          <>
            <Text size="3" variant="gray" css={{ mt: '$1', mb: '$4' }}>
              Use the ingest URL <code>{stream.ingestUrl}</code> and stream key{' '}
              <code>{stream.streamKey}</code> in a stream client like OBS to see
              content below.
            </Text>
            <Flex css={{ my: '$3', justifyContent: 'center' }}>
              <Spinner />
            </Flex>
          </>
        ) : (
          <Box css={{ mt: '$2' }}>
            <VideoPlayer src={stream?.playbackUrl} />
          </Box>
        ))}
    </Box>
  );
};
