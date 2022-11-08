import { Asset } from 'livepeer';
import { createClient } from 'livepeer/client';
import { studioProvider } from 'livepeer/providers/studio';

import { CombinedMedia } from './create-dataset';
import * as fs from 'fs';

const BATCH_SIZE = 10;

// create the livepeer.js client
const { provider } = createClient({
  provider: studioProvider(),
});

type MediaResult = {
  assetId: string;
  success: boolean;
  errorMessage?: string;
  seconds: number;
} & CombinedMedia;

const importVideo = async (
  video: CombinedMedia,
): Promise<{
  asset: Asset;
  source: CombinedMedia;
  startTime: number;
}> => {
  try {
    const asset = await provider.createAsset({
      sources: [
        {
          name: video.url,
          url: video.url,
        },
      ] as const,
    });

    return {
      asset: asset[0],
      source: video,
      startTime: Date.now(),
    };
  } catch (e) {
    console.warn('error with createAsset, retrying', e);
    return importVideo(video);
  }
};

export const importVideos = async (videos: CombinedMedia[]) => {
  const uploadedVideos: MediaResult[] = [];

  while (videos.length) {
    // splice the input array into batches of BATCH_SIZE
    const videoBatch = videos.splice(0, BATCH_SIZE);

    // upload the videos using createAsset
    const createdVideos = (
      await Promise.all(videoBatch.map(async (video) => importVideo(video)))
    )
      .filter((e) => e)
      .map((e) => e!);

    console.log(`Uploaded ${createdVideos.length} videos`);

    // wait for upload results for the videos using getAsset
    const batchStatuses = await Promise.all(
      createdVideos.map(async (importedVideo) => {
        let asset: Asset | null = null;

        while (
          asset?.status?.phase !== 'ready' &&
          asset?.status?.phase !== 'failed'
        ) {
          try {
            // wait w/ random jitter
            await new Promise((resolve) =>
              setTimeout(resolve, Math.random() * 600 + 600),
            );

            asset = await provider.getAsset(importedVideo.asset.id);
          } catch (e) {
            console.warn('error with getAsset, retrying', e);
          }
        }

        console.log(
          `${asset.status.phase}: ${asset.id} :: url: ${
            importedVideo.source.url
          } :: error: ${asset.status.errorMessage ?? 'none'}`,
        );

        return {
          assetId: asset.id,
          success: asset.status.phase === 'ready',
          ...(asset.status.errorMessage
            ? { errorMessage: asset.status.errorMessage }
            : {}),
          seconds: (Date.now() - importedVideo.startTime) / 1000,
          ...importedVideo.source,
        } as MediaResult;
      }),
    );

    // add results to final array
    uploadedVideos.push(...batchStatuses);

    // write to file as a checkpoint
    fs.writeFileSync('results.json', JSON.stringify(uploadedVideos, null, 2));
  }

  return uploadedVideos;
};

(async () => {
  const videos = JSON.parse(
    fs.readFileSync('output.json', 'utf8'),
  ) as CombinedMedia[];

  await importVideos(videos);
})().then(() => console.log('Done!'));
