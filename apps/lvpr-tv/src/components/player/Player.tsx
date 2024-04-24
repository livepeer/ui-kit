import * as Player from "@livepeer/react/player";

import {
  EnterFullscreenIcon,
  ExitFullscreenIcon,
  LoadingIcon,
  MuteIcon,
  PauseIcon,
  PictureInPictureIcon,
  PlayIcon,
  UnmuteIcon,
} from "@livepeer/react/assets";
import { getSrc } from "@livepeer/react/external";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import { Clip } from "./Clip";
import { CurrentSource } from "./CurrentSource";

import { livepeer } from "@/lib/livepeer";
import { cn } from "@/lib/utils";
import type { ClipLength } from "@livepeer/react";
import { ForceError } from "./ForceError";
import { Settings } from "./Settings";

export type PlayerProps = Partial<{
  type: "clipping" | "iframe";
  url: string | null;
  playbackId: string | null;
  autoplay: boolean;
  muted: boolean;
  loop: boolean;
  lowLatency: boolean | "force";
  objectFit: "cover" | "contain";
  constant: boolean;
  clipLength: ClipLength | null;
  jwt: string | null;
  debug: boolean;
}>;

const getPlaybackInfoUncached = cache(async (playbackId: string) => {
  const playbackInfo = await livepeer.playback.get(playbackId);

  if (!playbackInfo.playbackInfo) {
    console.error("Error fetching playback info", playbackInfo);

    throw new Error("Error fetching playback info");
  }

  return playbackInfo.playbackInfo;
});

const getPlaybackInfo = async (id: string) => {
  try {
    const result = await unstable_cache(
      async () => getPlaybackInfoUncached(id),
      ["get-playback-info", id],
      {
        revalidate: 120,
      },
    )();

    return result;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export async function PlayerWithControls(props: PlayerProps) {
  if (!props.playbackId && !props.url) {
    return (
      <PlayerLoading
        title="Invalid parameters"
        description="We could not find valid playback information for the URL you provided. Please check and try again."
      />
    );
  }

  const inputSource = props.playbackId
    ? await getPlaybackInfo(props.playbackId)
    : props.url;

  const src = getSrc(inputSource);

  if (!src) {
    return (
      <PlayerLoading
        title="Invalid source"
        description="We could not fetch valid playback information for the playback ID you provided. Please check and try again."
      />
    );
  }

  return (
    <Player.Root
      autoPlay={props.autoplay}
      volume={props.muted ? 0 : undefined}
      lowLatency={props.lowLatency}
      clipLength={props.clipLength ?? null}
      playbackRate={props.constant ? "constant" : undefined}
      jwt={props.jwt}
      src={src}
      aspectRatio={null}
      storage={null}
    >
      <Player.Container className="flex-1 h-full w-full overflow-hidden bg-black outline-none transition-all">
        <Player.Video
          title="Live stream"
          className={cn(
            "h-full w-full transition-all",
            props.objectFit === "contain" ? "object-contain" : "object-cover",
          )}
        />

        <Player.LoadingIndicator className="w-full relative h-full bg-black/50 backdrop-blur data-[visible=true]:animate-in data-[visible=false]:animate-out data-[visible=false]:fade-out-0 data-[visible=true]:fade-in-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <LoadingIcon className="w-8 h-8 animate-spin" />
          </div>
          <PlayerLoading />
        </Player.LoadingIndicator>

        <Player.ErrorIndicator
          matcher="all"
          className="absolute select-none inset-0 text-center bg-black/40 backdrop-blur-lg flex flex-col items-center justify-center gap-4 duration-1000 data-[visible=true]:animate-in data-[visible=false]:animate-out data-[visible=false]:fade-out-0 data-[visible=true]:fade-in-0"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <LoadingIcon className="w-8 h-8 animate-spin" />
          </div>
          <PlayerLoading />
        </Player.ErrorIndicator>

        <Player.ErrorIndicator
          matcher="offline"
          className="absolute select-none animate-in fade-in-0 inset-0 text-center bg-black/40 backdrop-blur-lg flex flex-col items-center justify-center gap-4 duration-1000 data-[visible=true]:animate-in data-[visible=false]:animate-out data-[visible=false]:fade-out-0 data-[visible=true]:fade-in-0"
        >
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <div className="text-lg sm:text-2xl font-bold">
                Stream is offline
              </div>
              <div className="text-xs sm:text-sm text-gray-100">
                Playback will start automatically once the stream has started
              </div>
            </div>
            <LoadingIcon className="w-6 h-6 md:w-8 md:h-8 mx-auto animate-spin" />
          </div>
        </Player.ErrorIndicator>

        <Player.ErrorIndicator
          matcher="access-control"
          className="absolute select-none inset-0 text-center bg-black/40 backdrop-blur-lg flex flex-col items-center justify-center gap-4 duration-1000 data-[visible=true]:animate-in data-[visible=false]:animate-out data-[visible=false]:fade-out-0 data-[visible=true]:fade-in-0"
        >
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <div className="text-lg sm:text-2xl font-bold">
                Stream is private
              </div>
              <div className="text-xs sm:text-sm text-gray-100">
                It looks like you don't have permission to view this content
              </div>
            </div>
            <LoadingIcon className="w-6 h-6 md:w-8 md:h-8 mx-auto animate-spin" />
          </div>
        </Player.ErrorIndicator>

        <Player.Controls className="bg-gradient-to-b gap-1 px-3 md:px-3 py-2 flex-col-reverse flex from-black/5 via-80% via-black/30 duration-1000 to-black/60 data-[visible=true]:animate-in data-[visible=false]:animate-out data-[visible=false]:fade-out-0 data-[visible=true]:fade-in-0">
          <div className="flex justify-between gap-4">
            <div className="flex flex-1 items-center gap-3">
              <Player.PlayPauseTrigger className="w-6 h-6 hover:scale-110 transition-all flex-shrink-0">
                <Player.PlayingIndicator asChild matcher={false}>
                  <PlayIcon className="w-full h-full" />
                </Player.PlayingIndicator>
                <Player.PlayingIndicator asChild>
                  <PauseIcon className="w-full h-full" />
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
                  <MuteIcon className="w-full h-full" />
                </Player.VolumeIndicator>
                <Player.VolumeIndicator asChild matcher={true}>
                  <UnmuteIcon className="w-full h-full" />
                </Player.VolumeIndicator>
              </Player.MuteTrigger>
              <Player.Volume className="relative mr-1 flex-1 group flex cursor-pointer items-center select-none touch-none max-w-[120px] h-5">
                <Player.Track className="bg-white/30 relative grow rounded-full transition-all h-[2px] md:h-[3px] group-hover:h-[3px] group-hover:md:h-[4px]">
                  <Player.Range className="absolute bg-white rounded-full h-full" />
                </Player.Track>
                <Player.Thumb className="block transition-all group-hover:scale-110 w-3 h-3 bg-white rounded-full" />
              </Player.Volume>
            </div>
            <div className="flex sm:flex-1 md:flex-[1.5] justify-end items-center gap-2.5">
              <Player.FullscreenIndicator matcher={false} asChild>
                <Settings className="w-6 h-6 transition-all flex-shrink-0" />
              </Player.FullscreenIndicator>
              <Clip className="flex items-center w-6 h-6 justify-center" />

              <Player.PictureInPictureTrigger className="w-6 h-6 hover:scale-110 transition-all flex-shrink-0">
                <PictureInPictureIcon className="w-full h-full" />
              </Player.PictureInPictureTrigger>

              <Player.FullscreenTrigger className="w-6 h-6 hover:scale-110 transition-all flex-shrink-0">
                <Player.FullscreenIndicator asChild>
                  <ExitFullscreenIcon className="w-full h-full" />
                </Player.FullscreenIndicator>

                <Player.FullscreenIndicator matcher={false} asChild>
                  <EnterFullscreenIcon className="w-full h-full" />
                </Player.FullscreenIndicator>
              </Player.FullscreenTrigger>
            </div>
          </div>
          <Player.Seek className="relative group flex cursor-pointer items-center select-none touch-none w-full h-5">
            <Player.Track className="bg-white/30 relative grow rounded-full transition-all h-[2px] md:h-[3px] group-hover:h-[3px] group-hover:md:h-[4px]">
              <Player.SeekBuffer className="absolute bg-black/30 transition-all duration-1000 rounded-full h-full" />
              <Player.Range className="absolute bg-white rounded-full h-full" />
            </Player.Track>
            <Player.Thumb className="block group-hover:scale-110 w-3 h-3 bg-white transition-all rounded-full" />
          </Player.Seek>

          {props.debug && (
            <div className="mb-2 flex flex-col gap-2">
              <div>
                <ForceError />
              </div>
              <CurrentSource />
            </div>
          )}
        </Player.Controls>
      </Player.Container>
    </Player.Root>
  );
}

export const PlayerLoading = ({
  title,
  description,
}: { title?: React.ReactNode; description?: React.ReactNode }) => (
  <div className="relative h-full w-full px-3 py-2 gap-3 flex-col-reverse flex bg-white/10 overflow-hidden rounded-sm">
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

    {title && (
      <div className="absolute flex flex-col gap-1 inset-10 text-center justify-center items-center">
        <span className="text-white text-lg font-medium">{title}</span>
        {description && (
          <span className="text-sm text-white/80">{description}</span>
        )}
      </div>
    )}
  </div>
);

function isInIframe() {
  try {
    return typeof window !== "undefined" && window.self !== window.top;
  } catch (e) {
    // if accessing window.top throws an exception due to cross-origin policy,
    // the catch block will also return true,
    // indicating the code is running inside an iframe
    return true;
  }
}
