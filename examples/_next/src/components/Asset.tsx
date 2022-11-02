import { useCreateAsset, useUpdateAsset } from '@livepeer/react';
import { useState } from 'react';

export const Asset = () => {
  const [video, setVideo] = useState<File | undefined>();
  const { mutate: createAsset, data: asset, status } = useCreateAsset();
  // const { data: asset } = useAsset({
  //   assetId: createdAsset?.id,
  //   refetchInterval: 10000,
  // });
  const { mutate: updateAsset, status: updateStatus, error } = useUpdateAsset();

  return (
    <div>
      <input
        type="file"
        accept="video/*"
        onChange={(e) => setVideo(e?.target?.files?.[0])}
      />
      <button
        disabled={!video || status === 'loading'}
        onClick={() => {
          if (video) {
            createAsset({
              name: video.name,
              file: video,
            });
          }
        }}
      >
        Create Asset
      </button>
      <button
        disabled={
          !asset?.id || status === 'loading' || updateStatus === 'loading'
        }
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
      {asset && (
        <>
          <div>Asset Name: {asset?.name}</div>
          <div>Playback URL: {asset?.playbackUrl}</div>
          <div>IPFS CID: {asset?.storage?.ipfs?.cid ?? 'None'}</div>
        </>
      )}
      {error && <div>{error.message}</div>}
    </div>
  );
};
