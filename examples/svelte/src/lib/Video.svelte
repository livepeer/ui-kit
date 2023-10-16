<script>
  import {
    addMediaMetrics,
    canPlayMediaNatively,
  } from '@livepeer/core-web/media/browser';
  import { getMediaSourceType } from '@livepeer/core-web/media';
  import { createClient } from '@livepeer/core-web/client';
  import { createNewHls, isHlsSupported } from '@livepeer/core-web/media/browser/hls';
  import { studioProvider } from '@livepeer/core-web/providers/studio';
  import { onMount } from 'svelte';

  let videoSrc = '';
  let video;

  const { provider } = createClient({
    provider: studioProvider({
      apiKey: process.env.VITE_PUBLIC_STUDIO_API_KEY ?? '',
    }),
  });

  async function fetchPlaybackInfo() {
    const playbackInfo = await provider.getPlaybackInfo({
      playbackId: 'bafybeigtqixg4ywcem3p6sitz55wy6xvnr565s6kuwhznpwjices3mmxoe',
    });

    const source = playbackInfo?.meta?.source?.[0]?.url;

    const hlsSrc = getMediaSourceType(source);

    addMediaMetrics(video, source, (e) =>
      console.error('Error adding metrics', e),
    );

    if (isHlsSupported() && hlsSrc.type === 'hls') {
      createNewHls(hlsSrc.src, video);
    } else if (canPlayMediaNatively('application/vnd.apple.mpegurl')) {
      videoSrc = source;
    }
  }

  onMount(fetchPlaybackInfo);
</script>

<main>
  <video controls width="100%" autoplay muted bind:this={video} src={videoSrc}>
    <track kind="captions" />
  </video>
</main>
