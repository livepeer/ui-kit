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
    const { destroy } = addMediaMetrics(ref.current);

    return () => destroy();
  });

  return (
    <main className="flex flex-col md:flex-row min-h-screen justify-center items-center bg-black gap-12 p-10">
      {/* biome-ignore lint/a11y/useMediaCaption: <explanation> */}
      <video
        controls
        ref={ref}
        src={src?.find((s) => s.type === "hls")?.src}
        autoPlay
      />
    </main>
  );
}
