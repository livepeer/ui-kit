import { useCreateAsset, useUpdateAsset } from '@livepeer/react';
import { useState } from 'react';

export const Asset = () => {
  const [videos, setVideos] = useState<File[]>([]);

  const { mutate: createAssets, data: assets, status } = useCreateAsset();

  const { mutate: updateAsset, status: updateStatus, error } = useUpdateAsset();

  const handleCreateAsset = async () => {
    const files = videos.map((video) => ({
      file: video,
      name: video.name,
    }));

    createAssets(files);
  };

  return (
    <div>
      <input
        type="file"
        multiple
        accept="video/*"
        onChange={(e) => {
          if (e.target.files) {
            setVideos(Array.from(e.target.files));
          }
        }}
      />
      <button
        disabled={!videos || status === 'loading'}
        onClick={() => {
          handleCreateAsset();
        }}
      >
        Create Assets
      </button>

      <>
        {assets?.map((asset) => (
          <div
            style={{
              marginTop: 20,
            }}
            key={asset.id}
          >
            <div>
              <div>Asset Name: {asset?.name}</div>
              <div>Playback URL: {asset?.playbackUrl}</div>
              <div>IPFS CID: {asset?.storage?.ipfs?.cid ?? 'None'}</div>
            </div>
            <button
              disabled={status === 'loading' || updateStatus === 'loading'}
              onClick={async () => {
                if (asset?.id) {
                  updateAsset({
                    assetId: asset.id,
                    storage: {
                      ipfs: true,
                    },
                  });
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
