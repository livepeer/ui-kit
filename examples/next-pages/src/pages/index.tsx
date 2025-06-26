import { getSrc } from "@livepeer/react/external";
import type { InferGetServerSidePropsType } from "next";
import { PlayerWithControls } from "@/components/Player";
import { livepeer } from "@/lib/livepeer";

const playbackId = "9491n0th73i8hlpi";

export const getServerSideProps = async () => {
  const playbackInfo = await livepeer.playback.get(playbackId);

  const src = getSrc(playbackInfo.playbackInfo);

  return { props: { src } };
};

export default function Page({
  src,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <main className="flex flex-col md:flex-row min-h-screen justify-center items-center bg-black gap-12 p-10">
      <PlayerWithControls src={src} playbackId={playbackId} />
    </main>
  );
}
