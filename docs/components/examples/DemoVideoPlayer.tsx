import { Text } from '@livepeer/design-system';
import { VideoPlayer, useMetrics } from '@livepeer/react';
import * as React from 'react';

const playbackId = 'a4e8o6mykgkvtxav';

export const DemoVideoPlayer = () => {
  const { data: metrics } = useMetrics({ playbackId, refetchInterval: 20000 });

  return (
    <>
      <VideoPlayer className="mt-6" playbackId={playbackId} loop muted />
      <Text css={{ mt: '$2' }}>Views: {metrics?.[0]?.startViews ?? 0}</Text>
    </>
  );
};
