import { parsePlaybackInfo } from "@livepeer/react";
import * as Assets from "@livepeer/react/assets";
import * as Player from "@livepeer/react/player";

import { notFound } from "next/navigation";
import { cache } from "react";
import { livepeer } from "../livepeer";
import { Clip } from "./Clip";
import { Settings } from "./Settings";

const playbackId = "561bbgj8fgnk61l7";

const getPlaybackInfo = cache(async (playbackId: string) => {
  try {
    const playbackInfo = await livepeer.playback.get(playbackId);

    const src = parsePlaybackInfo(playbackInfo.playbackInfo);

    return src;
  } catch (e) {
    console.error(e);
    return null;
  }
});

export async function PlayerWithControls() {
  const src = await getPlaybackInfo(playbackId);

  if (!src) {
    return notFound();
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Player.Root
        autoPlay
        aspectRatio={16 / 9}
        // playbackRate={1.5}
        clipLength={30}
        src={src}
      >
        <Player.Container className="w-full h-full overflow-hidden rounded-md bg-gray-950 outline-white/50 outline outline-1">
          <Player.Video
            title="Live stream"
            className="w-full h-full object-contain"
          />

          <Player.LoadingIndicator className="w-full relative h-full">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <Assets.LoadingIcon className="w-8 h-8 animate-spin" />
            </div>
            <Player.Poster className="w-full h-full opacity-45 object-cover" />
            <PlayerLoading />
          </Player.LoadingIndicator>

          <Player.ErrorIndicator
            matcher="offline"
            className="absolute select-none animate-in fade-in-0 inset-0 text-center bg-gray-950 flex flex-col items-center justify-center gap-4"
          >
            <Assets.OfflineErrorIcon className="h-[120px] w-full sm:flex hidden" />
            <div className="flex flex-col gap-1">
              <div className="text-2xl font-bold">Stream is offline</div>
              <div className="text-sm text-gray-100">
                Playback will start automatically once the stream has started
              </div>
            </div>
          </Player.ErrorIndicator>

          <Player.ErrorIndicator
            matcher="access-control"
            className="absolute select-none animate-in fade-in-0 inset-0 text-center bg-gray-950 flex flex-col items-center justify-center gap-4"
          >
            <Assets.PrivateErrorIcon className="h-[120px] w-full sm:flex hidden" />
            <div className="flex flex-col gap-1">
              <div className="text-2xl font-bold">Stream is private</div>
              <div className="text-sm text-gray-100">
                It looks like you don't have permission to view this content
              </div>
            </div>
          </Player.ErrorIndicator>

          <Player.Controls className="bg-gradient-to-b gap-1 px-3 md:px-3 py-2 flex-col-reverse flex from-black/20 via-80% via-black/30 duration-1000 to-black/60 data-[visible=true]:animate-in data-[visible=false]:animate-out data-[visible=false]:fade-out-0 data-[visible=true]:fade-in-0">
            <div className="flex justify-between gap-4">
              <div className="flex flex-1 items-center gap-3">
                <Player.PlayPauseTrigger className="w-6 h-6 hover:scale-110 transition-all flex-shrink-0">
                  <Player.PlayingIndicator asChild matcher={false}>
                    <Assets.PlayIcon className="w-full h-full" />
                  </Player.PlayingIndicator>
                  <Player.PlayingIndicator asChild>
                    <Assets.PauseIcon className="w-full h-full" />
                  </Player.PlayingIndicator>
                </Player.PlayPauseTrigger>

                <Player.LiveIndicator className="gap-2 flex items-center">
                  <div className="bg-red-600 h-1.5 w-1.5 rounded-full" />
                  <span className="text-sm select-none">LIVE</span>
                </Player.LiveIndicator>
                <Player.LiveIndicator
                  matcher={false}
                  className="flex gap-2 items-center"
                >
                  <Player.Time className="text-sm tabular-nums select-none" />
                </Player.LiveIndicator>

                <Player.MuteTrigger className="w-6 h-6 hover:scale-110 transition-all flex-shrink-0">
                  <Player.VolumeIndicator asChild matcher={false}>
                    <Assets.MuteIcon className="w-full h-full" />
                  </Player.VolumeIndicator>
                  <Player.VolumeIndicator asChild matcher={true}>
                    <Assets.UnmuteIcon className="w-full h-full" />
                  </Player.VolumeIndicator>
                </Player.MuteTrigger>
                <Player.Volume className="relative mr-1 flex-1 group flex cursor-pointer items-center select-none touch-none max-w-full h-5">
                  <Player.Track className="bg-white/30 relative grow rounded-full h-[2px] md:h-[3px]">
                    <Player.Range className="absolute bg-white rounded-full h-full" />
                  </Player.Track>
                  <Player.Thumb className="block transition-all group-hover:scale-110 w-3 h-3 bg-white rounded-full" />
                </Player.Volume>
              </div>
              <div className="flex sm:flex-1 md:flex-[1.5] justify-end items-center gap-2.5">
                <Settings className="w-6 h-6 hover:scale-110 transition-all flex-shrink-0" />
                <Clip className="flex items-center w-6 h-6 justify-center" />

                <Player.PictureInPictureTrigger className="w-6 h-6 hover:scale-110 transition-all flex-shrink-0">
                  <Assets.PictureInPictureIcon className="w-full h-full" />
                </Player.PictureInPictureTrigger>

                <Player.FullscreenTrigger className="w-6 h-6 hover:scale-110 transition-all flex-shrink-0">
                  <Player.FullscreenIndicator asChild>
                    <Assets.ExitFullscreenIcon className="w-full h-full" />
                  </Player.FullscreenIndicator>

                  <Player.FullscreenIndicator matcher={false} asChild>
                    <Assets.EnterFullscreenIcon className="w-full h-full" />
                  </Player.FullscreenIndicator>
                </Player.FullscreenTrigger>
              </div>
            </div>
            <Player.Seek className="relative group flex cursor-pointer items-center select-none touch-none w-full h-5">
              <Player.Track className="bg-white/30 relative grow rounded-full h-[2px] md:h-[3px]">
                <Player.SeekBuffer className="absolute bg-black/30 transition-all rounded-full h-full" />
                <Player.Range className="absolute bg-white rounded-full h-full" />
              </Player.Track>
              <Player.Thumb className="block group-hover:scale-110 w-3 h-3 bg-white rounded-full" />
            </Player.Seek>
          </Player.Controls>
        </Player.Container>
      </Player.Root>
    </div>
  );
}

export const PlayerLoading = () => (
  <div className="w-full px-3 md:px-3 py-3 gap-3 flex-col-reverse flex aspect-video max-w-2xl mx-auto animate-pulse bg-white/10 overflow-hidden rounded-sm">
    <div className="flex justify-between">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 animate-pulse bg-white/5 overflow-hidden rounded-lg" />
        <div className="w-16 h-6 md:w-20 md:h-7 animate-pulse bg-white/5 overflow-hidden rounded-lg" />
      </div>

      <div className="flex items-center gap-2">
        <div className="w-6 h-6 animate-pulse bg-white/5 overflow-hidden rounded-lg" />
        <div className="w-6 h-6 animate-pulse bg-white/5 overflow-hidden rounded-lg" />
      </div>
    </div>
    <div className="w-full h-2 animate-pulse bg-white/5 overflow-hidden rounded-lg" />
  </div>
);
