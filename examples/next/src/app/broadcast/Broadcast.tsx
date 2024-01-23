"use client";

import * as Assets from "@livepeer/react/assets";
import * as Broadcast from "@livepeer/react/broadcast";

import { useState } from "react";

export function BroadcastWithControls() {
  const [streamKey, setStreamKey] = useState<string | null>(
    "806d-bdx4-q6re-k1h0",
  );

  return (
    <div className="w-full max-w-2xl gap-4 flex flex-col items-center mx-auto">
      <div className="flex flex-col items-center gap-1">
        <label className="text-xs text-white/80" htmlFor="streamKey">
          Stream Key
        </label>
        <input
          name="streamKey"
          type="text"
          className="focus:outline-none font-light text-white/90 text-sm focus:ring-1 focus:ring-white/30 px-1 rounded-sm bg-white/5"
          onChange={(e) => setStreamKey(e.target.value)}
          value={streamKey ?? undefined}
        />
      </div>
      {streamKey && (streamKey?.length ?? 0) === 19 ? (
        <Broadcast.Root
          aspectRatio={16 / 9}
          className="w-full h-full overflow-hidden rounded-sm bg-gray-950"
          streamKey={streamKey}
        >
          <Broadcast.Video title="Live stream" className="w-full h-full" />

          <Broadcast.LoadingIndicator className="w-full relative h-full">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <Assets.LoadingIcon className="w-8 h-8 animate-spin" />
            </div>
            <BroadcastLoading />
          </Broadcast.LoadingIndicator>

          <Broadcast.ErrorIndicator
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
          </Broadcast.ErrorIndicator>

          <Broadcast.ErrorIndicator
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
          </Broadcast.ErrorIndicator>

          <Broadcast.Controls className="bg-gradient-to-b gap-1 px-3 md:px-3 py-1.5 flex-col-reverse flex from-black/20 via-80% via-black/30 duration-1000 to-black/60 data-[visible=true]:animate-in data-[visible=false]:animate-out data-[visible=false]:fade-out-0 data-[visible=true]:fade-in-0">
            <div className="flex justify-between gap-4">
              <div className="flex flex-1 items-center gap-3">
                <Broadcast.LoadingIndicator asChild matcher={false}>
                  <Broadcast.EnabledIndicator asChild>
                    <Broadcast.EnabledTrigger className="w-6 h-6 md:w-7 md:h-7 hover:scale-110 transition-all flex-shrink-0">
                      <Assets.StopIcon className="w-7 h-7" />
                    </Broadcast.EnabledTrigger>
                  </Broadcast.EnabledIndicator>
                </Broadcast.LoadingIndicator>

                <Broadcast.MuteTrigger className="w-6 h-6 md:w-7 md:h-7 hover:scale-110 transition-all flex-shrink-0">
                  <Broadcast.VolumeIndicator asChild matcher={false}>
                    <Assets.MuteIcon className="w-full h-full" />
                  </Broadcast.VolumeIndicator>
                  <Broadcast.VolumeIndicator asChild matcher={true}>
                    <Assets.UnmuteIcon className="w-full h-full" />
                  </Broadcast.VolumeIndicator>
                </Broadcast.MuteTrigger>
                <Broadcast.Volume className="relative mr-1 flex-1 group flex cursor-pointer items-center select-none touch-none max-w-full h-5">
                  <Broadcast.Track className="bg-white/30 relative grow rounded-full h-[2px] md:h-[3px]">
                    <Broadcast.Range className="absolute bg-white rounded-full h-full" />
                  </Broadcast.Track>
                  <Broadcast.Thumb className="block transition-all group-hover:scale-110 w-3 h-3 bg-white rounded-full" />
                </Broadcast.Volume>
              </div>
              <div className="flex sm:flex-1 md:flex-[1.5] justify-end items-center gap-2.5">
                <Broadcast.PictureInPictureTrigger className="w-6 h-6 md:w-7 md:h-7 hover:scale-110 transition-all flex-shrink-0">
                  <Assets.PictureInPictureIcon className="w-full h-full" />
                </Broadcast.PictureInPictureTrigger>

                <Broadcast.FullscreenTrigger className="w-6 h-6 md:w-7 md:h-7 hover:scale-110 transition-all flex-shrink-0">
                  <Broadcast.FullscreenIndicator asChild>
                    <Assets.ExitFullscreenIcon className="w-full h-full" />
                  </Broadcast.FullscreenIndicator>

                  <Broadcast.FullscreenIndicator matcher={false} asChild>
                    <Assets.EnterFullscreenIcon className="w-full h-full" />
                  </Broadcast.FullscreenIndicator>
                </Broadcast.FullscreenTrigger>
              </div>
            </div>
          </Broadcast.Controls>

          <Broadcast.EnabledIndicator className="gap-2 absolute overflow-hidden py-1 px-2 rounded-full top-1 left-1 bg-black/50 flex items-center backdrop-blur">
            <div className="bg-red-500 animate-pulse h-1.5 w-1.5 rounded-full" />
            <span className="text-xs select-none">LIVE</span>
          </Broadcast.EnabledIndicator>

          <Broadcast.LoadingIndicator asChild matcher={false}>
            <Broadcast.EnabledIndicator asChild matcher={false}>
              <Broadcast.EnabledTrigger asChild>
                <button
                  type="button"
                  className="absolute inset-0 flex-col gap-1 flex backdrop-blur-md rounded-md items-center justify-center px-4 py-2 bg-black/10 hover:bg-black/20"
                >
                  <Assets.EnableVideoIcon className="w-7 h-7" />
                  <span className="text-sm">Start broadcast</span>
                </button>
              </Broadcast.EnabledTrigger>
            </Broadcast.EnabledIndicator>
          </Broadcast.LoadingIndicator>
        </Broadcast.Root>
      ) : (
        <BroadcastLoading />
      )}
    </div>
  );
}

export const BroadcastLoading = () => (
  <div className="w-full px-3 md:px-3 py-3 gap-3 flex-col-reverse flex aspect-video max-w-2xl mx-auto animate-pulse bg-white/10 overflow-hidden rounded-sm">
    <div className="flex justify-between">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 md:w-7 md:h-7 animate-pulse bg-white/5 overflow-hidden rounded-lg" />
        <div className="w-16 h-6 md:w-20 md:h-7 animate-pulse bg-white/5 overflow-hidden rounded-lg" />
      </div>

      <div className="flex items-center gap-2">
        <div className="w-6 h-6 md:w-7 md:h-7 animate-pulse bg-white/5 overflow-hidden rounded-lg" />
        <div className="w-6 h-6 md:w-7 md:h-7 animate-pulse bg-white/5 overflow-hidden rounded-lg" />
      </div>
    </div>
    <div className="w-full h-2 animate-pulse bg-white/5 overflow-hidden rounded-lg" />
  </div>
);
