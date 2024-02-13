"use client";

import { SettingsIcon } from "@livepeer/react/assets";
import * as Broadcast from "@livepeer/react/broadcast";
import * as Popover from "@radix-ui/react-popover";

import { cn } from "@/lib/utils";
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
            aria-label="Stream settings"
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
              <p className="text-white/90 font-medium text-sm mb-1">
                Stream settings
              </p>

              <div className="gap-2 flex-col flex">
                <label
                  className="text-xs text-white/90 font-medium"
                  htmlFor="cameraSource"
                >
                  Camera ('c' to rotate)
                </label>
                <SourceSelectComposed name="cameraSource" type="videoinput" />
              </div>

              <div className="gap-2 flex-col flex">
                <label
                  className="text-xs text-white/90 font-medium"
                  htmlFor="microphoneSource"
                >
                  Microphone ('m' to rotate)
                </label>
                <SourceSelectComposed
                  name="microphoneSource"
                  type="audioinput"
                />
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

export const SourceSelectComposed = React.forwardRef(
  (
    {
      name,
      type,
      className,
    }: { name: string; type: "audioinput" | "videoinput"; className?: string },
    ref: React.Ref<HTMLButtonElement> | undefined,
  ) => (
    <Broadcast.SourceSelect name={name} type={type}>
      {(devices) =>
        devices ? (
          <>
            <Broadcast.SelectTrigger
              ref={ref}
              className={cn(
                "flex w-full items-center overflow-hidden justify-between rounded-sm px-1 outline-1 outline-white/50 text-xs leading-none h-7 gap-1 outline-none disabled:opacity-70 disabled:cursor-not-allowed",
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
                      <SourceSelectItem
                        key={device.deviceId}
                        value={device.deviceId}
                      >
                        {device.friendlyName}
                      </SourceSelectItem>
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
  ),
);

const SourceSelectItem = React.forwardRef<
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
