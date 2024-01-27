"use client";

import { cn } from "@/lib/utils";
import * as Assets from "@livepeer/react/assets";
import * as Broadcast from "@livepeer/react/broadcast";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import React from "react";

import { useRef, useState } from "react";

export function BroadcastWithControls() {
  const portalRef = useRef<HTMLDivElement | null>(null);
  const [streamKey, setStreamKey] = useState<string | null>(
    "398d-5x6h-0yy6-zhq2",
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
        <>
          <Broadcast.Root aspectRatio={16 / 9} streamKey={streamKey}>
            <Broadcast.Container className="w-full h-full overflow-hidden rounded-sm bg-gray-950">
              <Broadcast.Video title="Live stream" className="w-full h-full" />

              <Broadcast.LoadingIndicator className="w-full relative h-full">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <Assets.LoadingIcon className="w-8 h-8 animate-spin" />
                </div>
                <BroadcastLoading />
              </Broadcast.LoadingIndicator>

              <Broadcast.ErrorIndicator
                matcher="all"
                className="absolute select-none inset-0 text-center bg-gray-950 flex flex-col items-center justify-center gap-4 duration-1000 data-[visible=true]:animate-in data-[visible=false]:animate-out data-[visible=false]:fade-out-0 data-[visible=true]:fade-in-0"
              >
                <Assets.OfflineErrorIcon className="h-[120px] w-full sm:flex hidden" />
                <div className="flex flex-col gap-1">
                  <div className="text-2xl font-bold">Broadcast failed</div>
                  <div className="text-sm text-gray-100">
                    There was an error with broadcasting - it is retrying in the
                    background.
                  </div>
                </div>
              </Broadcast.ErrorIndicator>

              <Broadcast.Controls className="bg-gradient-to-b gap-1 px-3 md:px-3 py-1.5 flex-col-reverse flex from-black/20 via-80% via-black/30 duration-1000 to-black/60 data-[visible=true]:animate-in data-[visible=false]:animate-out data-[visible=false]:fade-out-0 data-[visible=true]:fade-in-0">
                <div className="flex justify-between gap-4">
                  <div className="flex flex-1 items-center gap-3">
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

              <Broadcast.LoadingIndicator asChild matcher={false}>
                <div className="absolute overflow-hidden py-1 px-2 rounded-full top-1 left-1 bg-black/50 flex items-center backdrop-blur">
                  <Broadcast.EnabledIndicator
                    matcher={true}
                    className="flex gap-2 items-center"
                  >
                    <div className="bg-red-500 animate-pulse h-1.5 w-1.5 rounded-full" />
                    <span className="text-xs select-none">LIVE</span>
                  </Broadcast.EnabledIndicator>

                  <Broadcast.EnabledIndicator
                    className="flex gap-2 items-center"
                    matcher={false}
                  >
                    <div className="bg-white/80 h-1.5 w-1.5 rounded-full" />
                    <span className="text-xs select-none">OFF</span>
                  </Broadcast.EnabledIndicator>
                </div>
              </Broadcast.LoadingIndicator>
            </Broadcast.Container>

            <Broadcast.LoadingIndicator asChild matcher={false}>
              <Broadcast.EnabledTrigger className="rounded-md px-4 py-2 bg-white/5 hover:bg-white/10">
                <Broadcast.EnabledIndicator
                  className="gap-1 flex items-center justify-center"
                  matcher={false}
                >
                  <Assets.EnableVideoIcon className="w-7 h-7" />
                  <span className="text-sm">Start broadcast</span>
                </Broadcast.EnabledIndicator>
                <Broadcast.EnabledIndicator
                  className="gap-1 flex items-center justify-center"
                  matcher={true}
                >
                  <Assets.StopIcon className="w-7 h-7" />
                  <span className="text-sm">Stop broadcast</span>
                </Broadcast.EnabledIndicator>
              </Broadcast.EnabledTrigger>
            </Broadcast.LoadingIndicator>

            <Broadcast.ScreenshareTrigger>
              Share screen
            </Broadcast.ScreenshareTrigger>

            <div className="w-full flex flex-col sm:flex-row gap-4 items-center justify-center">
              <SourceSelectComposed type="videoinput" className="w-[200px]" />
              <SourceSelectComposed type="audioinput" className="w-[200px]" />
            </div>
          </Broadcast.Root>
        </>
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

const SourceSelectComposed = ({
  type,
  className,
}: { type: "audioinput" | "videoinput"; className?: string }) => (
  <Broadcast.SourceSelect name="videoSource" type={type}>
    {(devices) =>
      devices ? (
        <>
          <Broadcast.SelectTrigger
            className={cn(
              "flex w-full items-center overflow-hidden justify-between rounded-sm px-1 outline-1 outline-white/50 text-xs leading-none h-7 gap-1 outline-none",
              className,
            )}
            aria-label={type === "audioinput" ? "Audio input" : "Video input"}
          >
            <Broadcast.SelectValue
              placeholder={
                type === "audioinput"
                  ? "Select an audio input"
                  : "Select a video input"
              }
            />
            <Broadcast.SelectIcon>
              <ChevronDownIcon className="h-4 w-4" />
            </Broadcast.SelectIcon>
          </Broadcast.SelectTrigger>
          <Broadcast.SelectPortal>
            <Broadcast.SelectContent className="overflow-hidden bg-black rounded-sm">
              <Broadcast.SelectViewport className="p-1">
                <Broadcast.SelectGroup>
                  {devices?.map((device) => (
                    <RateSelectItem
                      key={device.deviceId}
                      value={device.deviceId}
                    >
                      {device.friendlyName}
                    </RateSelectItem>
                  ))}
                </Broadcast.SelectGroup>
              </Broadcast.SelectViewport>
            </Broadcast.SelectContent>
          </Broadcast.SelectPortal>
        </>
      ) : (
        <span>There was an error fetching the available devices.</span>
      )
    }
  </Broadcast.SourceSelect>
);

const RateSelectItem = React.forwardRef<
  HTMLDivElement,
  Broadcast.SelectItemProps
>(({ children, className, ...props }, forwardedRef) => {
  return (
    <Broadcast.SelectItem
      className={cn(
        "text-xs leading-none rounded-sm flex items-center h-7 pr-[35px] pl-[25px] relative select-none data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-white/20",
        className,
      )}
      {...props}
      ref={forwardedRef}
    >
      <Broadcast.SelectItemText>{children}</Broadcast.SelectItemText>
      <Broadcast.SelectItemIndicator className="absolute left-0 w-[25px] inline-flex items-center justify-center">
        <CheckIcon className="w-4 h-4" />
      </Broadcast.SelectItemIndicator>
    </Broadcast.SelectItem>
  );
});
