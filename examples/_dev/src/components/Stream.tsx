import { useCreateStream, useStream, useStreamSessions } from '@livepeer/react';

const streamName = `New Stream`;

export const Stream = () => {
  const { mutateAsync, data: createdStream } = useCreateStream();
  const { data: stream } = useStream(createdStream?.id);
  const { data: streamSessions } = useStreamSessions(createdStream?.id);

  return (
    <div>
      <button
        onClick={async () =>
          mutateAsync({
            name: streamName,
          })
        }
      >
        Create Stream
      </button>
      {stream && <div>Stream Key: {stream.streamKey}</div>}
      {streamSessions && (
        <>
          <div>Stream Sessions: ({streamSessions.length}) </div>
          {streamSessions.length > 0 && (
            <div>
              Playback URLs:{' '}
              {streamSessions.map((session) => session.playbackUrl).join(', ')}
            </div>
          )}
        </>
      )}
    </div>
  );
};
