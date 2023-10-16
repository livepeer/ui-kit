import ClippingPage from './ClippingPage';

export const metadata = {
  title: 'Clipping',
};

export default async function Page({
  params,
}: {
  params: { streamKey?: string; sessionId?: string[] | string };
}) {
  return params?.streamKey ? (
    <ClippingPage
      playbackId={params.streamKey}
      sessionId={
        params.sessionId
          ? typeof params.sessionId === 'string'
            ? String(params.sessionId)
            : String(params.sessionId[0])
          : undefined
      }
    />
  ) : (
    <div
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
      }}
    >
      <span>
        No playback ID found. Please check that the URL contains a playback ID
        and try again.
      </span>
    </div>
  );
}
