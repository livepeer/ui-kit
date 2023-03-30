import {
  CreateAssetSourceFile,
  Player,
  Src,
  WebhookPlaybackPolicy,
  useCreateAsset,
} from '@livepeer/react';
import fetch from 'cross-fetch';
import { useCallback, useState } from 'react';

import { SecretResponse } from '../pages/api/secret';

// const playbackId = 'ipfs://bafybeifavmtea3u5ulvrkdzc2wnjwjl35jefqiyhgruxu2cjd4kumymqm4'; // ipfs asset
// const playbackId = '499fa78eu8g59m26'; // asset
// const playbackId = '1dd6omrqq7htwgig'; // public stream
// const playbackId = '0b3a57ekt0n6ie08'; // gated stream
// const playbackId = '740c7a3g4ipyur5g'; // gated stream

export const AssetDemoPlayer = () => {
  const [videos, setVideos] = useState<File[]>([]);
  const [sources, setSources] = useState<Set<string>>(new Set());

  const assetSources: CreateAssetSourceFile[] = videos.map((video) => ({
    name: video.name ?? 'Cool Video',
    file: video,
    // storage: {
    //   ipfs: true,
    //   metadata: {
    //     name: 'interesting video',
    //     description: 'overridden',
    //   },
    // },
  }));

  const {
    mutate: createAsset,
    data: assets,
    progress,
    error,
  } = useCreateAsset({
    sources: assetSources,
    playbackPolicy: {
      type: 'webhook',
      webhookId: '7e7cf81b-28f3-48e3-9284-195cbe4d5c0b',
      webhookContext: {
        userId: 'this is a demo user id which is passed along to the backend',
      },
    },
  });

  const onSourceUpdated = useCallback(
    (sources: Src[]) => setSources(new Set([sources?.[0]?.src])),
    [],
  );

  return (
    <>
      <div style={{ marginBottom: 30 }}>
        <label>
          Videos:{' '}
          <input
            type="file"
            name="videos"
            accept="video/mp4,video/x-m4v,video/*"
            onChange={(e) => setVideos([...(e.target.files ?? [])])}
            title="Choose file(s)"
            multiple
          />
        </label>

        {createAsset && videos.length > 0 && (
          <button onClick={() => createAsset()}>Upload</button>
        )}
        {progress &&
          progress.map((p) => (
            <p key={p.name}>
              {p.name}: {p.phase} - {Math.floor(p.progress * 100)}
            </p>
          ))}
        {error && <p>{error.message}</p>}
      </div>
      {sources && [...sources].map((s) => <p key={s}>{s}</p>)}
      {assets?.map((a) => (
        <Player
          key={a.id}
          playbackId={a.playbackId}
          loop
          autoPlay
          showPipButton
          onSourceUpdated={onSourceUpdated}
          onAccessKeyRequest={async (
            playbackPolicy: WebhookPlaybackPolicy<{ userId: string }>,
          ) => {
            await new Promise((r) => setTimeout(r, 10000));

            const result = await fetch('/api/secret', {
              method: 'POST',
              body: JSON.stringify({
                userId: playbackPolicy.webhookContext.userId,
              }),
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
              },
            });
            const json: SecretResponse = await result.json();

            return json.secret;
          }}
          theme={{
            fonts: {
              display: 'Inter',
            },
            colors: {
              accent: '#72DDF7',
              progressLeft: '#F7AEF8',
              progressMiddle: '#F7AEF8',
              progressRight: '#F7AEF8',
              progressThumb: '#F4F4ED',
            },
          }}
        />
      ))}
    </>
  );
};
