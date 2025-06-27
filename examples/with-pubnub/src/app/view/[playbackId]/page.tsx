import { getSrc } from "@livepeer/react/external";
import { getPlaybackInfo } from "@/lib/livepeer";
import { PlayerLoading } from "../../../components/player/Player";
import PlayerWithChat from "./PlayerWithChat";

export default async function PlayerPage({
  params,
}: {
  params: { playbackId: string };
}) {
  const inputSource = await getPlaybackInfo(params.playbackId);

  const src = getSrc(inputSource);

  return src ? (
    <PlayerWithChat src={src} />
  ) : (
    <PlayerLoading>
      <div className="absolute flex flex-col inset-0 justify-center items-center">
        <span className="text-sm text-white/80">Video is not available.</span>
        <span className="text-sm text-white/80">
          Please try refreshing the page in a few seconds.
        </span>
      </div>
    </PlayerLoading>
  );
}
