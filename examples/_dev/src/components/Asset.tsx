import { useAsset, useCreateAsset } from '@livepeer/react';
import { useState } from 'react';

export const Asset = () => {
  const [video, setVideo] = useState<File | undefined>();
  const { mutateAsync, data: createdAsset, status } = useCreateAsset();
  const { data: asset } = useAsset(createdAsset?.id);

  return (
    <div>
      <input
        type="file"
        accept="video/*"
        onChange={(e) => setVideo(e?.target?.files?.[0])}
      />
      <button
        disabled={!video || status === 'loading'}
        onClick={async () => {
          if (video) {
            mutateAsync({
              name: video.name,
              file: video,
            });
          }
        }}
      >
        Create Asset
      </button>
      {asset && (
        <>
          <div>Asset Name: {asset?.name}</div>
          <div>Playback URL: {asset?.playbackUrl}</div>
        </>
      )}
    </div>
  );
};
