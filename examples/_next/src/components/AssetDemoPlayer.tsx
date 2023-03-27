import {
  CreateAssetSourceFile,
  Player,
  Src,
  useCreateAsset,
} from '@livepeer/react';
import { useCallback, useState } from 'react';

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
    storage: {
      ipfs: true,
      metadata: {
        name: 'interesting video',
        description: 'overridden',
      },
    },
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
      webhookId: '',
      webhookContext: {
        userValue: '',
      },
    },
  });

  const onSourceUpdated = useCallback(
    (sources: Src[]) =>
      setSources((prev) => new Set([...prev, sources?.[0]?.src])),
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
