import { prefetchPlaybackInfo, studioProvider } from '@livepeer/react';

export const prefetchPlaybackStaticProps = async (playbackId: string) => {
  const dehydratedState = await prefetchPlaybackInfo(
    {
      playbackId,
    },
    {
      provider: studioProvider({
        apiKey: process.env.NEXT_PUBLIC_STUDIO_API_KEY,
      }),
    },
  );

  return {
    props: {
      dehydratedState,
    },
    revalidate: 600,
  };
};
