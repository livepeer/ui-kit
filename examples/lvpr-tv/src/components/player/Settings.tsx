"use client";

import * as Player from "@livepeer/react/player";
import * as Popover from "@radix-ui/react-popover";

import { cn } from "@/lib/utils";
import { SettingsIcon } from "@livepeer/react/assets";
import { CheckIcon, ChevronDownIcon, XIcon } from "lucide-react";
import React from "react";

export const Settings = React.forwardRef(
  (
    { className }: { className?: string },
    ref: React.Ref<HTMLButtonElement> | undefined,
  ) => {
    return (
      <Popover.Root>
        <Popover.Trigger ref={ref} asChild>
          <button
            type="button"
            className={className}
            aria-label="Playback settings"
            onClick={(e) => e.stopPropagation()}
          >
            <SettingsIcon />
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            className="w-60 rounded-md bg-black/50 border border-white/50 backdrop-blur-md p-3 shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
            side="top"
            alignOffset={-70}
            align="end"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-2">
              <p className="text-white/90 font-medium text-sm mb-1">Settings</p>
              <Player.LiveIndicator
                matcher={false}
                className="gap-2 flex-col flex"
              >
                <label
                  className="text-xs text-white/90 font-medium"
                  htmlFor="speedSelect"
                >
                  Playback speed
                </label>
                <Player.RateSelect name="speedSelect">
                  <Player.SelectTrigger
                    className="inline-flex items-center justify-between rounded-sm px-1 outline-1 outline-white/50 text-xs leading-none h-7 gap-1 outline-none"
                    aria-label="Playback speed"
                  >
                    <Player.SelectValue placeholder="Select a speed..." />
                    <Player.SelectIcon>
                      <ChevronDownIcon className="h-4 w-4" />
                    </Player.SelectIcon>
                  </Player.SelectTrigger>
                  <Player.SelectPortal>
                    <Player.SelectContent className="overflow-hidden bg-black rounded-sm">
                      <Player.SelectViewport className="p-1">
                        <Player.SelectGroup>
                          <RateSelectItem value={0.5}>0.5x</RateSelectItem>
                          <RateSelectItem value={0.75}>0.75x</RateSelectItem>
                          <RateSelectItem value={1}>1x (normal)</RateSelectItem>
                          <RateSelectItem value={1.25}>1.25x</RateSelectItem>
                          <RateSelectItem value={1.5}>1.5x</RateSelectItem>
                          <RateSelectItem value={1.75}>1.75x</RateSelectItem>
                          <RateSelectItem value={2}>2x</RateSelectItem>
                        </Player.SelectGroup>
                      </Player.SelectViewport>
                    </Player.SelectContent>
                  </Player.SelectPortal>
                </Player.RateSelect>
              </Player.LiveIndicator>
              <div className="gap-2 flex-col flex">
                <label
                  className="text-xs text-white/90 font-medium"
                  htmlFor="qualitySelect"
                >
                  Quality
                </label>
                <Player.VideoQualitySelect
                  name="qualitySelect"
                  defaultValue="1.0"
                >
                  <Player.SelectTrigger
                    className="inline-flex items-center justify-between rounded-sm px-1 outline-1 outline-white/50 text-xs leading-none h-7 gap-1 outline-none"
                    aria-label="Playback quality"
                  >
                    <Player.SelectValue placeholder="Select a quality..." />
                    <Player.SelectIcon>
                      <ChevronDownIcon className="h-4 w-4" />
                    </Player.SelectIcon>
                  </Player.SelectTrigger>
                  <Player.SelectPortal>
                    <Player.SelectContent className="overflow-hidden bg-black rounded-sm">
                      <Player.SelectViewport className="p-[5px]">
                        <Player.SelectGroup>
                          <VideoQualitySelectItem value="auto">
                            Auto (HD+)
                          </VideoQualitySelectItem>
                          <VideoQualitySelectItem value="1080p">
                            1080p (HD)
                          </VideoQualitySelectItem>
                          <VideoQualitySelectItem value="720p">
                            720p
                          </VideoQualitySelectItem>
                          <VideoQualitySelectItem value="480p">
                            480p
                          </VideoQualitySelectItem>
                          <VideoQualitySelectItem value="360p">
                            360p
                          </VideoQualitySelectItem>
                        </Player.SelectGroup>
                      </Player.SelectViewport>
                    </Player.SelectContent>
                  </Player.SelectPortal>
                </Player.VideoQualitySelect>
              </div>
            </div>
            <Popover.Close
              className="rounded-full h-5 w-5 inline-flex items-center justify-center absolute top-2.5 right-2.5 outline-none"
              aria-label="Close"
            >
              <XIcon />
            </Popover.Close>
            <Popover.Arrow className="fill-white/50" />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    );
  },
);

const RateSelectItem = React.forwardRef<
  HTMLDivElement,
  Player.RateSelectItemProps
>(({ children, className, ...props }, forwardedRef) => {
  return (
    <Player.RateSelectItem
      className={cn(
        "text-xs leading-none rounded-sm flex items-center h-7 pr-[35px] pl-[25px] relative select-none data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-white/20",
        className,
      )}
      {...props}
      ref={forwardedRef}
    >
      <Player.SelectItemText>{children}</Player.SelectItemText>
      <Player.SelectItemIndicator className="absolute left-0 w-[25px] inline-flex items-center justify-center">
        <CheckIcon className="w-4 h-4" />
      </Player.SelectItemIndicator>
    </Player.RateSelectItem>
  );
});

const VideoQualitySelectItem = React.forwardRef<
  HTMLDivElement,
  Player.VideoQualitySelectItemProps
>(({ children, className, ...props }, forwardedRef) => {
  return (
    <Player.VideoQualitySelectItem
      className={cn(
        "text-xs leading-none rounded-sm flex items-center h-7 pr-[35px] pl-[25px] relative select-none data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-white/20",
        className,
      )}
      {...props}
      ref={forwardedRef}
    >
      <Player.SelectItemText>{children}</Player.SelectItemText>
      <Player.SelectItemIndicator className="absolute left-0 w-[25px] inline-flex items-center justify-center">
        <CheckIcon className="w-4 h-4" />
      </Player.SelectItemIndicator>
    </Player.VideoQualitySelectItem>
  );
});
