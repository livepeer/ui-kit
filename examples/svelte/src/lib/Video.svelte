<script>
  import {
    canPlayMediaNatively,
    getMediaSourceType,
    getMetricsReportingUrl,
    getPlaybackInfo,
    reportMediaMetrics
  } from "livepeer";
  import {
    createClient
  } from "livepeer/client";
  import {
    isHlsSupported
  } from "livepeer/media/hls";
  import { studioProvider } from "livepeer/providers/studio";
  import { onMount } from "svelte";

  let videoSrc = "";
  let video;

  createClient({ provider: studioProvider() });

  async function fetchPlaybackInfo() {
    const playbackInfo = await getPlaybackInfo({
      playbackId: "bafybeigtqixg4ywcem3p6sitz55wy6xvnr565s6kuwhznpwjices3mmxoe",
    });

    const source = playbackInfo?.meta?.source?.[0]?.url;

    const hlsSrc = getMediaSourceType(source);

    if (isHlsSupported() && hlsSrc.type === "hls") {
      createNewHls(
        hlsSrc,
        video,
        () => {},
        () => {},
        () => {}
      );
    } else if (canPlayMediaNatively("application/vnd.apple.mpegurl")) {
      videoSrc = source;

      const metricReportingUrl = await getMetricsReportingUrl(hlsSrc.src);
      if (metricReportingUrl) {
        reportMediaMetrics(video, metricReportingUrl);
      } else {
        console.log(
          "Not able to report player metrics given the source url",
          source
        );
      }
    }
  }

  onMount(fetchPlaybackInfo);
</script>

<main>
  <video controls width="100%" autoplay muted bind:this={video} src={videoSrc}>
    <track kind="captions" />
  </video>
</main>
