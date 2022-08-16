import {
  useCreateStream,
  useStream,
  useStreamSessions,
  useUpdateStream,
} from '@livepeer/react';

const streamName = `New Stream`;

export const Stream = () => {
  const { mutate: createStream, data: createdStream } = useCreateStream();
  const { data: stream } = useStream({
    streamId: createdStream?.id,
    refetchInterval: 10000,
  });
  const { data: streamSessions } = useStreamSessions(createdStream?.id);
  const { mutate: updateStream } = useUpdateStream();

  return (
    <div>
      <button
        onClick={() =>
          createStream({
            name: streamName,
          })
        }
      >
        Create Stream
      </button>
      {stream && (
        <>
          <div>Stream Key: {stream.streamKey}</div>
          <div>Recording?: {String(Boolean(stream.record))}</div>
        </>
      )}
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
      <div>
        <button
          onClick={() => {
            if (stream?.id) {
              updateStream({
                streamId: stream?.id,
                record: true,
              });
            }
          }}
        >
          Record Stream
        </button>
      </div>
    </div>
  );
};
