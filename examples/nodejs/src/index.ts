import { Asset, createAsset, getAsset } from 'livepeer';
import { createClient } from 'livepeer/client';
import { studioProvider } from 'livepeer/providers/studio';

import * as fs from 'fs';

const BATCH_SIZE = 20;

// create the global livepeer.js client
createClient({
  provider: studioProvider(),
});

type CombinedMedia = {
  url: string;
  mimeType: string;
  isDStorage: boolean;
  source: 'zora' | 'lens';
};

export const importVideos = async (videos: CombinedMedia[]) => {
  const uploadedVideos: ({
    assetId: Asset['id'];
    success: boolean;
    errorMessage?: string;
    seconds: number;
  } & CombinedMedia)[] = [];

  while (videos.length) {
    const videoBatch = videos.splice(0, BATCH_SIZE);

    const createdVideos = await Promise.all(
      videoBatch.map(async (video) => {
        const asset = await createAsset({
          name: video.url,
          url: video.url,
        });

        return {
          asset,
          source: video,
          startTime: Date.now(),
        };
      }),
    );

    console.log(`Started ${createdVideos.length} videos`);

    const batchStatuses = await Promise.all(
      createdVideos.map(async (importedVideo) => {
        let asset: Asset | null = null;

        while (
          asset?.status?.phase !== 'ready' &&
          asset?.status?.phase !== 'failed'
        ) {
          // introduce random jitter
          await new Promise((resolve) =>
            setTimeout(resolve, Math.random() * 300 + 200),
          );

          asset = await getAsset(importedVideo.asset.id);
        }

        console.log(
          `${asset.status.phase}: ${asset.id} -- error: ${
            asset.status.errorMessage ?? 'none'
          }`,
        );

        return {
          assetId: asset.id,
          success: asset.status.phase === 'ready',
          ...(asset.status.errorMessage
            ? { errorMessage: asset.status.errorMessage }
            : {}),
          seconds: (Date.now() - importedVideo.startTime) / 1000,
          ...importedVideo.source,
        };
      }),
    );

    uploadedVideos.push(...batchStatuses);
  }

  return uploadedVideos;
};

(async () => {
  const videos = JSON.parse(
    fs.readFileSync('output.json', 'utf8'),
  ) as CombinedMedia[];

  const mappedVideos = videos.slice(10, 30).map((video) => ({
    ...video,
    url: video.url.replace('ipfs.infura.io', 'infura-ipfs.io'),
  }));

  const results = await importVideos(mappedVideos);

  fs.writeFileSync('results.json', JSON.stringify(results, null, 2));
})().then(() => console.log('Done!'));
