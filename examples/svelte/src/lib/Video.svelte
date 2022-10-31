<script>
  import {
    addMediaMetrics,
    canPlayMediaNatively,
    getMediaSourceType,
    getPlaybackInfo,
  } from 'livepeer';
  import { createClient } from 'livepeer/client';
  import { createNewHls, isHlsSupported } from 'livepeer/media/hls';
  import { studioProvider } from 'livepeer/providers/studio';
  import { onMount } from 'svelte';

  let videoSrc = '';
  let video;

  createClient({ provider: studioProvider() });

  async function fetchPlaybackInfo() {
    const playbackInfo = await getPlaybackInfo({
      playbackId: 'bafybeigtqixg4ywcem3p6sitz55wy6xvnr565s6kuwhznpwjices3mmxoe',
    });

    const source = playbackInfo?.meta?.source?.[0]?.url;

    const hlsSrc = getMediaSourceType(source);

    addMediaMetrics(video, source, (e) =>
      console.error('Error adding metrics', e),
    );

    if (isHlsSupported() && hlsSrc.type === 'hls') {
      createNewHls(
        hlsSrc,
        video,
        () => {},
        () => {},
        () => {},
      );
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
