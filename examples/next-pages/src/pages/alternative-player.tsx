import { livepeer } from "@/lib/livepeer";
import { addMediaMetrics } from "@livepeer/core-web/browser";
import { getSrc } from "@livepeer/react/external";

import type { InferGetServerSidePropsType } from "next";
import { useEffect, useRef } from "react";

const playbackId = "b7f3rvvf5rnzzy29";

export const getServerSideProps = async () => {
  const playbackInfo = await livepeer.playback.get(playbackId);

  const src = getSrc(playbackInfo.playbackInfo);

  return { props: { src } };
};

export default function Page({
  src,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const videoElement = ref.current;

    const handlePause = () => {
      // const event = new Event("timeupdate");
      if (videoElement) {
        videoElement.currentTime = 0;
      }
      // videoElement?.dispatchEvent(event);
    };

    videoElement?.addEventListener("pause", handlePause);

    const { destroy } = addMediaMetrics(videoElement, {
      disableProgressListener: true,
    });

    // Cleanup function to remove event listener and destroy metrics when component unmounts
    return () => {
      videoElement?.removeEventListener("pause", handlePause);
      destroy();
    };
  }, []);

  return (
    <main className="flex flex-col md:flex-row min-h-screen justify-center items-center bg-black gap-12 p-10">
      {/* biome-ignore lint/a11y/useMediaCaption: <explanation> */}
      <video
        controls
        muted
        ref={ref}
        src="https://vod-cdn.lp-playback.studio/raw/jxf4iblf6wlsyor6526t4tcmtmqa/catalyst-vod-com/hls/0b79ukgd9vf7t0ae/static2160p0.mp4"
        autoPlay
      />
    </main>
  );
}
