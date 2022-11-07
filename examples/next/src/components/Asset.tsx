import { useCreateAsset, useUpdateAsset } from '@livepeer/react';
import { useState } from 'react';

export const Asset = () => {
  const [videos, setVideos] = useState<File[]>([]);
  const {
    mutate: createAsset,
    data: assets,
    status,
  } = useCreateAsset({
    sources: videos.map((video) => ({
      file: video,
      name: video.name,
    })),
  });
  const {
    mutate: uploadToIpfs,
    status: updateStatus,
    error,
  } = useUpdateAsset(
    assets?.[0].id
      ? {
          assetId: assets?.[0].id,
          storage: { ipfs: true },
        }
      : null,
  );

  return (
    <div>
      <input
        type="file"
        multiple
        accept="video/*"
        onChange={(e) => {
          if (e.target.files) {
            setVideos([...e.target.files]);
          }
        }}
      />
      <button
        disabled={!videos || status === 'loading'}
        onClick={() => {
          createAsset?.();
        }}
      >
        Create Assets
      </button>
      <>
        {assets?.map((asset) => (
          <div key={asset.id}>
            <div>
              <div>Asset Name: {asset?.name}</div>
              <div>Playback URL: {asset?.playbackUrl}</div>
              <div>IPFS CID: {asset?.storage?.ipfs?.cid ?? 'None'}</div>
            </div>
            <button
              disabled={status === 'loading' || updateStatus === 'loading'}
              onClick={async () => {
                if (asset?.id) {
                  uploadToIpfs?.();
                }
              }}
            >
              Upload to IPFS
            </button>
          </div>
        ))}
      </>
      {error && <div>{error.message}</div>}
    </div>
  );
};
