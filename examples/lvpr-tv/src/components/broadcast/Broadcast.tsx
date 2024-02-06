import { cn } from "@/lib/utils";
import {
  DisableAudioIcon,
  DisableVideoIcon,
  EnableAudioIcon,
  EnableVideoIcon,
  EnterFullscreenIcon,
  ExitFullscreenIcon,
  LoadingIcon,
  OfflineErrorIcon,
  PictureInPictureIcon,
  SettingsIcon,
  StartScreenshareIcon,
  StopIcon,
  StopScreenshareIcon,
} from "@livepeer/react/assets";
import * as Broadcast from "@livepeer/react/broadcast";
import * as Popover from "@radix-ui/react-popover";
import { CheckIcon, ChevronDownIcon, XIcon } from "lucide-react";
import React from "react";

import { toast } from "sonner";

export function BroadcastWithControls({
  ingestUrl,
}: {
  ingestUrl: string | null;
}) {
  return !ingestUrl ? (
    <BroadcastLoading
      title="Invalid stream key"
      description="The stream key provided was invalid. Please check and try again."
    />
  ) : (
    <>
      <Broadcast.Root
        onError={(error) =>
          error?.type === "permissions"
            ? toast.error(
                "You must accept permissions to broadcast. Please try again.",
              )
            : null
        }
        aspectRatio={16 / 9}
        ingestUrl={ingestUrl}
      >
        <Broadcast.Container className="w-full h-full overflow-hidden rounded-sm bg-gray-950">
          <Broadcast.Video title="Live stream" className="w-full h-full" />

          <Broadcast.LoadingIndicator className="w-full relative h-full">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <LoadingIcon className="w-8 h-8 animate-spin" />
            </div>
            <BroadcastLoading />
          </Broadcast.LoadingIndicator>

          <Broadcast.ErrorIndicator
            matcher="not-permissions"
            className="absolute select-none inset-0 text-center bg-gray-950 flex flex-col items-center justify-center gap-4 duration-1000 data-[visible=true]:animate-in data-[visible=false]:animate-out data-[visible=false]:fade-out-0 data-[visible=true]:fade-in-0"
          >
            <OfflineErrorIcon className="h-[120px] w-full sm:flex hidden" />
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
                <Broadcast.VideoEnabledTrigger className="w-6 h-6 hover:scale-110 transition-all flex-shrink-0">
                  <Broadcast.VideoEnabledIndicator asChild matcher={false}>
                    <DisableVideoIcon className="w-full h-full" />
                  </Broadcast.VideoEnabledIndicator>
                  <Broadcast.VideoEnabledIndicator asChild matcher={true}>
                    <EnableVideoIcon className="w-full h-full" />
                  </Broadcast.VideoEnabledIndicator>
                </Broadcast.VideoEnabledTrigger>
                <Broadcast.AudioEnabledTrigger className="w-6 h-6 hover:scale-110 transition-all flex-shrink-0">
                  <Broadcast.AudioEnabledIndicator asChild matcher={false}>
                    <DisableAudioIcon className="w-full h-full" />
                  </Broadcast.AudioEnabledIndicator>
                  <Broadcast.AudioEnabledIndicator asChild matcher={true}>
                    <EnableAudioIcon className="w-full h-full" />
                  </Broadcast.AudioEnabledIndicator>
                </Broadcast.AudioEnabledTrigger>
              </div>
              <div className="flex sm:flex-1 md:flex-[1.5] justify-end items-center gap-2.5">
                <Broadcast.FullscreenIndicator matcher={false} asChild>
                  <Settings className="w-6 h-6 transition-all flex-shrink-0" />
                </Broadcast.FullscreenIndicator>

                <Broadcast.ScreenshareTrigger className="w-6 h-6 hover:scale-110 transition-all flex-shrink-0">
                  <Broadcast.ScreenshareIndicator asChild>
                    <StopScreenshareIcon className="w-full h-full" />
                  </Broadcast.ScreenshareIndicator>

                  <Broadcast.ScreenshareIndicator matcher={false} asChild>
                    <StartScreenshareIcon className="w-full h-full" />
                  </Broadcast.ScreenshareIndicator>
                </Broadcast.ScreenshareTrigger>

                <Broadcast.PictureInPictureTrigger className="w-6 h-6 hover:scale-110 transition-all flex-shrink-0">
                  <PictureInPictureIcon className="w-full h-full" />
                </Broadcast.PictureInPictureTrigger>

                <Broadcast.FullscreenTrigger className="w-6 h-6 hover:scale-110 transition-all flex-shrink-0">
                  <Broadcast.FullscreenIndicator asChild>
                    <ExitFullscreenIcon className="w-full h-full" />
                  </Broadcast.FullscreenIndicator>

                  <Broadcast.FullscreenIndicator matcher={false} asChild>
                    <EnterFullscreenIcon className="w-full h-full" />
                  </Broadcast.FullscreenIndicator>
                </Broadcast.FullscreenTrigger>
              </div>
            </div>
            <Broadcast.EnabledIndicator
              matcher={false}
              className="flex flex-1 items-center justify-center"
            >
              <Broadcast.EnabledTrigger className="rounded-md px-4 py-2 bg-black/60 hover:bg-black/70 gap-1 flex items-center justify-center">
                <EnableVideoIcon className="w-7 h-7" />
                <span className="text-sm">Start broadcast</span>
              </Broadcast.EnabledTrigger>
            </Broadcast.EnabledIndicator>
            <Broadcast.EnabledIndicator asChild>
              <Broadcast.EnabledTrigger className="top-1 right-2 absolute flex items-center justify-center gap-1 rounded-md px-4 py-2 bg-white/5 hover:bg-white/10">
                <StopIcon className="w-7 h-7" />
                <span className="text-sm">Stop broadcast</span>
              </Broadcast.EnabledTrigger>
            </Broadcast.EnabledIndicator>
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
                <span className="text-xs select-none">PREVIEW</span>
              </Broadcast.EnabledIndicator>
            </div>
          </Broadcast.LoadingIndicator>
        </Broadcast.Container>
      </Broadcast.Root>
    </>
  );
}

export const BroadcastLoading = ({
  title,
  description,
}: {
  title?: React.ReactNode;
  description?: React.ReactNode;
}) => (
  <div className="relative w-full px-3 md:px-3 py-3 gap-3 flex-col-reverse flex aspect-video bg-white/10 overflow-hidden rounded-sm">
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
  ),
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
