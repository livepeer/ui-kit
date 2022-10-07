import { Box, Button, Flex, Text } from '@livepeer/design-system';
import { Player, useStream, useUpdateStream } from '@livepeer/react';
import { useRouter } from 'next/router';
import { Callout } from 'nextra-theme-docs';

import { useMemo } from 'react';

import { Spinner } from '../core';

export const AccessControl = () => {
  const router = useRouter();

  const streamId = useMemo(
    () => (router?.query?.id ? String(router?.query?.id) : undefined),
    [router?.query],
  );

  const { data: stream, status } = useStream({
    streamId,
    refetchInterval: (s) => (!s?.isActive ? 5000 : false),
  });
  const { mutate: updateStream, data: updatedStream } = useUpdateStream();

  const isLoading = useMemo(() => status === 'loading', [status]);

  console.log({ stream });

  return !streamId ? (
    <Box css={{ my: '$4' }}>
      <Callout type="error" emoji="⚠️">
        <p>
          This is an extension of the{' '}
          <a href="/examples/react/view-stream">Create Stream</a> example.
          Please be sure to go through that example before trying this one -{' '}
          <strong>
            you will need an stream ID from that example in this demo.
          </strong>
        </p>
      </Callout>
    </Box>
  ) : (
    <Box css={{ my: '$6' }}>
      {stream &&
        stream.rtmpIngestUrl &&
        (!stream?.playbackUrl || !stream.isActive) && (
          <Text size="3" variant="gray" css={{ mt: '$3', mb: '$4' }}>
            Use the ingest URL <code>{stream.rtmpIngestUrl}</code> in a stream
            client like OBS to see content below.{' '}
            <strong>
              In this example, you must stream before applying access control.
            </strong>
          </Text>
        )}

      {stream?.playbackId && (
        <Box css={{ mt: '$2' }}>
          <Player
            title={stream?.name}
            playbackId={stream?.playbackId}
            autoPlay
            muted
            theme={{
              fonts: {
                display: 'Inter',
              },
            }}
          />
        </Box>
      )}

      {updatedStream?.playbackPolicy?.type !== 'jwt' && (
        <Flex css={{ jc: 'flex-end', gap: '$3', mt: '$4' }}>
          <Button
            css={{ display: 'flex', ai: 'center' }}
            onClick={() => {
              updateStream({
                streamId,
                playbackPolicy: {
                  type: 'jwt',
                },
              });
            }}
            size="2"
            disabled={isLoading}
            variant="primary"
          >
            {isLoading && <Spinner size={16} css={{ mr: '$1' }} />}
            Enable Access Control
          </Button>
        </Flex>
      )}
    </Box>
  );
};
