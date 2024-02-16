export const video = `import * as Broadcast from "@livepeer/react/broadcast";
import { getIngest } from "@livepeer/react/external";

import { streamKey } from "./stream-key";

export default () => {
  return (
    <Broadcast.Root ingestUrl={getIngest(streamKey)}>
      <Broadcast.Container>
        <Broadcast.Video
          title="Livestream"
          style={{ height: "100%", width: "100%" }}
        />
      </Broadcast.Container>
    </Broadcast.Root>
  );
};`;

export const use_broadcast_context = `import { EnableVideoIcon, StopIcon } from "@livepeer/react/assets";
import * as Broadcast from "@livepeer/react/broadcast";
import { useBroadcastContext, useStore } from "@livepeer/react/broadcast";
import { getIngest } from "@livepeer/react/external";
import { CSSProperties } from "react";
import { streamKey } from "./stream-key";

export default () => {
  return (
    <Broadcast.Root ingestUrl={getIngest(streamKey)}>
      <Broadcast.Video
        title="Livestream"
        style={{
          height: "100%",
          width: "100%",
          objectFit: "contain",
        }}
      />

      <CurrentSource
        style={{
          position: "absolute",
          left: 20,
          bottom: 20,
        }}
      />

      <Broadcast.EnabledTrigger
        style={{
          position: "absolute",
          right: 20,
          bottom: 20,
          width: 25,
          height: 25,
        }}
      >
        <Broadcast.EnabledIndicator asChild matcher={false}>
          <EnableVideoIcon />
        </Broadcast.EnabledIndicator>
        <Broadcast.EnabledIndicator asChild>
          <StopIcon />
        </Broadcast.EnabledIndicator>
      </Broadcast.EnabledTrigger>
    </Broadcast.Root>
  );
};

function CurrentSource({
  style,
  __scopeBroadcast,
}: Broadcast.BroadcastScopedProps<{ style?: CSSProperties }>) {
  const context = useBroadcastContext("CurrentSource", __scopeBroadcast);

  const { status } = useStore(context.store, ({ status }) => ({
    status,
  }));

  return status ? (
    <div style={style}>
      <span>
        Broadcast status:{" "}
        <span
          style={{
            color: "#ffffffe2",
          }}
        >
          {status}
        </span>
      </span>
    </div>
  ) : null;
}`;

export const stream_key = `export const streamKey = "0812-lotj-3i4c-37ie";`;

export const status = `import * as Broadcast from "@livepeer/react/broadcast";
import { getIngest } from "@livepeer/react/external";
import { streamKey } from "./stream-key";

export default () => {
  return (
    <Broadcast.Root ingestUrl={getIngest(streamKey)}>
      <Broadcast.Video
        title="Livestream"
        style={{
          height: "100%",
          width: "100%",
          objectFit: "contain",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 20,
          bottom: 20,
        }}
      >
        <Broadcast.StatusIndicator matcher="idle">
          Idle
        </Broadcast.StatusIndicator>
      </div>
    </Broadcast.Root>
  );
};`;

export const source = `import * as Broadcast from "@livepeer/react/broadcast";
import { getIngest } from "@livepeer/react/external";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import React from "react";
import { streamKey } from "./stream-key";

export default () => {
  return (
    <Broadcast.Root ingestUrl={getIngest(streamKey)}>
      <Broadcast.Video
        title="Livestream"
        style={{
          height: "100%",
          width: "100%",
          objectFit: "contain",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 20,
          bottom: 20,
          display: "flex",
          gap: 10,
        }}
      >
        <SourceSelectComposed name="cameraSource" type="videoinput" />
        <SourceSelectComposed name="microphoneSource" type="audioinput" />
      </div>
    </Broadcast.Root>
  );
};

const SourceSelectComposed = React.forwardRef(
  (
    { name, type }: { name: string; type: "audioinput" | "videoinput" },
    ref: React.Ref<HTMLButtonElement> | undefined,
  ) => (
    <Broadcast.SourceSelect name={name} type={type}>
      {(devices) =>
        devices ? (
          <>
            <Broadcast.SelectTrigger
              ref={ref}
              style={{
                minWidth: 120,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                height: 30,
                fontSize: 12,
                gap: 5,
                padding: 10,
                borderRadius: 5,
                outline: "white solid 1px",
              }}
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
                <ChevronDownIcon style={{ width: 14, height: 14 }} />
              </Broadcast.SelectIcon>
            </Broadcast.SelectTrigger>
            <Broadcast.SelectPortal>
              <Broadcast.SelectContent
                style={{
                  borderRadius: 5,
                  backgroundColor: "black",
                }}
              >
                <Broadcast.SelectViewport style={{ padding: 5 }}>
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
>(({ children, ...props }, forwardedRef) => {
  return (
    <Broadcast.SelectItem
      style={{
        fontSize: 12,
        borderRadius: 5,
        display: "flex",
        alignItems: "center",
        paddingRight: 35,
        paddingLeft: 25,
        position: "relative",
        userSelect: "none",
        height: 30,
      }}
      {...props}
      ref={forwardedRef}
    >
      <Broadcast.SelectItemText>{children}</Broadcast.SelectItemText>
      <Broadcast.SelectItemIndicator
        style={{
          position: "absolute",
          left: 0,
          width: 25,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CheckIcon style={{ width: 14, height: 14 }} />
      </Broadcast.SelectItemIndicator>
    </Broadcast.SelectItem>
  );
});`;

export const screenshare = `import {
  StartScreenshareIcon,
  StopScreenshareIcon,
} from "@livepeer/react/assets";
import * as Broadcast from "@livepeer/react/broadcast";
import { getIngest } from "@livepeer/react/external";
import { streamKey } from "./stream-key";

export default () => {
  return (
    <Broadcast.Root ingestUrl={getIngest(streamKey)}>
      <Broadcast.Video
        title="Livestream"
        style={{
          height: "100%",
          width: "100%",
          objectFit: "contain",
        }}
      />

      <Broadcast.ScreenshareTrigger
        style={{
          position: "absolute",
          left: 20,
          bottom: 20,
          width: 25,
          height: 25,
        }}
      >
        <Broadcast.ScreenshareIndicator asChild matcher={false}>
          <StartScreenshareIcon />
        </Broadcast.ScreenshareIndicator>
        <Broadcast.ScreenshareIndicator asChild>
          <StopScreenshareIcon />
        </Broadcast.ScreenshareIndicator>
      </Broadcast.ScreenshareTrigger>
    </Broadcast.Root>
  );
};`;

export const root = `import { EnableVideoIcon, StopIcon } from "@livepeer/react/assets";
import * as Broadcast from "@livepeer/react/broadcast";
import { getIngest } from "@livepeer/react/external";
import { streamKey } from "./stream-key";

export default () => {
  return (
    <Broadcast.Root ingestUrl={getIngest(streamKey)}>
      <Broadcast.Container>
        <Broadcast.Video
          title="Livestream"
          style={{
            height: "100%",
            width: "100%",
            objectFit: "contain",
          }}
        />

        <Broadcast.Controls className="flex items-center justify-center">
          <Broadcast.EnabledTrigger className="w-10 h-10 hover:scale-105 flex-shrink-0">
            <Broadcast.EnabledIndicator asChild matcher={false}>
              <EnableVideoIcon className="w-full h-full" />
            </Broadcast.EnabledIndicator>
            <Broadcast.EnabledIndicator asChild>
              <StopIcon className="w-full h-full" />
            </Broadcast.EnabledIndicator>
          </Broadcast.EnabledTrigger>
        </Broadcast.Controls>

        <Broadcast.LoadingIndicator asChild matcher={false}>
          <div className="absolute overflow-hidden py-1 px-2 rounded-full top-1 left-1 bg-black/50 flex items-center backdrop-blur">
            <Broadcast.StatusIndicator
              matcher="live"
              className="flex gap-2 items-center"
            >
              <div className="bg-red-500 animate-pulse h-1.5 w-1.5 rounded-full" />
              <span className="text-xs select-none">LIVE</span>
            </Broadcast.StatusIndicator>

            <Broadcast.StatusIndicator
              className="flex gap-2 items-center"
              matcher="pending"
            >
              <div className="bg-white/80 h-1.5 w-1.5 rounded-full animate-pulse" />
              <span className="text-xs select-none">LOADING</span>
            </Broadcast.StatusIndicator>

            <Broadcast.StatusIndicator
              className="flex gap-2 items-center"
              matcher="idle"
            >
              <div className="bg-white/80 h-1.5 w-1.5 rounded-full" />
              <span className="text-xs select-none">IDLE</span>
            </Broadcast.StatusIndicator>
          </div>
        </Broadcast.LoadingIndicator>
      </Broadcast.Container>
    </Broadcast.Root>
  );
};`;

export const portal = `import * as Broadcast from "@livepeer/react/broadcast";
import { getIngest } from "@livepeer/react/external";

import { useEffect, useRef, useState } from "react";
import { streamKey } from "./stream-key";

export default () => {
  const parentRef = useRef<HTMLDivElement | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (parentRef.current) {
      setIsMounted(true);
    }
  }, []);

  return (
    <>
      <div
        style={{
          height: 20,
          width: "100%",
        }}
        ref={parentRef}
      />
      <Broadcast.Root ingestUrl={getIngest(streamKey)}>
        <Broadcast.Container
          style={{
            margin: 5,
            borderRadius: 5,
            outline: "white solid 1px",
            overflow: "hidden",
          }}
        >
          <Broadcast.Video
            title="Livestream"
            style={{ height: "100%", width: "100%" }}
          />

          {/* This is portalled outside of the parent container,
           which is outlined in white */}
          {isMounted && (
            <Broadcast.Portal container={parentRef.current}>
              <Broadcast.Time />
            </Broadcast.Portal>
          )}
        </Broadcast.Container>
      </Broadcast.Root>
    </>
  );
};`;

export const pip = `import * as Broadcast from "@livepeer/react/broadcast";
import { getIngest } from "@livepeer/react/external";

import { PictureInPictureIcon } from "@livepeer/react/assets";
import { streamKey } from "./stream-key";

export default () => {
  return (
    <Broadcast.Root ingestUrl={getIngest(streamKey)}>
      <Broadcast.Container>
        <Broadcast.Video
          title="Livestream"
          style={{ height: "100%", width: "100%" }}
        />
        <Broadcast.PictureInPictureTrigger
          style={{
            position: "absolute",
            left: 20,
            bottom: 20,
            width: 25,
            height: 25,
          }}
        >
          <PictureInPictureIcon />
        </Broadcast.PictureInPictureTrigger>
      </Broadcast.Container>
    </Broadcast.Root>
  );
};`;

export const loading = `import * as Broadcast from "@livepeer/react/broadcast";
import { getIngest } from "@livepeer/react/external";

import { streamKey } from "./stream-key";

export default () => {
  return (
    <Broadcast.Root ingestUrl={getIngest(streamKey)}>
      <Broadcast.Container>
        <Broadcast.Video
          title="Livestream"
          style={{ height: "100%", width: "100%" }}
        />

        <Broadcast.LoadingIndicator
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "black",
          }}
        >
          Loading...
        </Broadcast.LoadingIndicator>
      </Broadcast.Container>
    </Broadcast.Root>
  );
};`;

export const getting_started = `import { EnableVideoIcon, StopIcon } from "@livepeer/react/assets";
import * as Broadcast from "@livepeer/react/broadcast";
import { getIngest } from "@livepeer/react/external";
import { streamKey } from "./stream-key";

export default () => {
  return (
    <Broadcast.Root ingestUrl={getIngest(streamKey)}>
      <Broadcast.Container className="h-full w-full bg-gray-950">
        <Broadcast.Video title="Current livestream" className="h-full w-full" />

        <Broadcast.Controls className="flex items-center justify-center">
          <Broadcast.EnabledTrigger className="w-10 h-10 hover:scale-105 flex-shrink-0">
            <Broadcast.EnabledIndicator asChild matcher={false}>
              <EnableVideoIcon className="w-full h-full" />
            </Broadcast.EnabledIndicator>
            <Broadcast.EnabledIndicator asChild>
              <StopIcon className="w-full h-full" />
            </Broadcast.EnabledIndicator>
          </Broadcast.EnabledTrigger>
        </Broadcast.Controls>

        <Broadcast.LoadingIndicator asChild matcher={false}>
          <div className="absolute overflow-hidden py-1 px-2 rounded-full top-1 left-1 bg-black/50 flex items-center backdrop-blur">
            <Broadcast.StatusIndicator
              matcher="live"
              className="flex gap-2 items-center"
            >
              <div className="bg-red-500 animate-pulse h-1.5 w-1.5 rounded-full" />
              <span className="text-xs select-none">LIVE</span>
            </Broadcast.StatusIndicator>

            <Broadcast.StatusIndicator
              className="flex gap-2 items-center"
              matcher="pending"
            >
              <div className="bg-white/80 h-1.5 w-1.5 rounded-full animate-pulse" />
              <span className="text-xs select-none">LOADING</span>
            </Broadcast.StatusIndicator>

            <Broadcast.StatusIndicator
              className="flex gap-2 items-center"
              matcher="idle"
            >
              <div className="bg-white/80 h-1.5 w-1.5 rounded-full" />
              <span className="text-xs select-none">IDLE</span>
            </Broadcast.StatusIndicator>
          </div>
        </Broadcast.LoadingIndicator>
      </Broadcast.Container>
    </Broadcast.Root>
  );
};`;

export const fullscreen = `import * as Broadcast from "@livepeer/react/broadcast";
import { getIngest } from "@livepeer/react/external";

import {
  EnterFullscreenIcon,
  ExitFullscreenIcon,
} from "@livepeer/react/assets";
import { streamKey } from "./stream-key";

export default () => {
  return (
    <Broadcast.Root ingestUrl={getIngest(streamKey)}>
      <Broadcast.Container>
        <Broadcast.Video
          title="Livestream"
          style={{ height: "100%", width: "100%" }}
        />
        <Broadcast.FullscreenTrigger
          style={{
            position: "absolute",
            left: 20,
            bottom: 20,
            width: 25,
            height: 25,
          }}
        >
          <Broadcast.FullscreenIndicator asChild matcher={false}>
            <EnterFullscreenIcon />
          </Broadcast.FullscreenIndicator>
          <Broadcast.FullscreenIndicator asChild>
            <ExitFullscreenIcon />
          </Broadcast.FullscreenIndicator>
        </Broadcast.FullscreenTrigger>
      </Broadcast.Container>
    </Broadcast.Root>
  );
};`;

export const error = `import * as Broadcast from "@livepeer/react/broadcast";
import { getIngest } from "@livepeer/react/external";

import { streamKey } from "./stream-key";

export default () => {
  return (
    <Broadcast.Root ingestUrl={getIngest(streamKey)}>
      <Broadcast.Container>
        <Broadcast.Video
          title="Livestream"
          style={{ height: "100%", width: "100%" }}
          onProgress={(e) => {
            // we fake an error here every time there is progress

            setTimeout(() => {
              e.target.dispatchEvent(new Event("error"));
            }, 7000);
          }}
        />

        <Broadcast.ErrorIndicator
          matcher="all"
          style={{
            position: "absolute",
            inset: 0,
            height: "100%",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "black",
          }}
        >
          An error occurred. Trying to resume broadcast...
        </Broadcast.ErrorIndicator>
      </Broadcast.Container>
    </Broadcast.Root>
  );
};`;

export const enabled = `import { EnableVideoIcon, StopIcon } from "@livepeer/react/assets";
import * as Broadcast from "@livepeer/react/broadcast";
import { getIngest } from "@livepeer/react/external";
import { streamKey } from "./stream-key";

export default () => {
  return (
    <Broadcast.Root ingestUrl={getIngest(streamKey)}>
      <Broadcast.Video
        title="Livestream"
        style={{
          height: "100%",
          width: "100%",
          objectFit: "contain",
        }}
      />

      <Broadcast.EnabledTrigger
        style={{
          position: "absolute",
          left: 20,
          bottom: 20,
          width: 25,
          height: 25,
        }}
      >
        <Broadcast.EnabledIndicator asChild matcher={false}>
          <EnableVideoIcon />
        </Broadcast.EnabledIndicator>
        <Broadcast.EnabledIndicator asChild>
          <StopIcon />
        </Broadcast.EnabledIndicator>
      </Broadcast.EnabledTrigger>
    </Broadcast.Root>
  );
};`;

export const controls = `import * as Broadcast from "@livepeer/react/broadcast";
import { getIngest } from "@livepeer/react/external";

import { streamKey } from "./stream-key";

export default () => {
  return (
    <Broadcast.Root ingestUrl={getIngest(streamKey)}>
      <Broadcast.Container>
        <Broadcast.Video
          title="Livestream"
          style={{ height: "100%", width: "100%" }}
        />

        <Broadcast.Controls
          style={{
            padding: 20,
          }}
          autoHide={5000}
        >
          Auto-hidden controls container for broadcast
        </Broadcast.Controls>
      </Broadcast.Container>
    </Broadcast.Root>
  );
};`;

export const container = `import * as Broadcast from "@livepeer/react/broadcast";
import { getIngest } from "@livepeer/react/external";

import { streamKey } from "./stream-key";

export default () => {
  return (
    <Broadcast.Root aspectRatio={null} ingestUrl={getIngest(streamKey)}>
      <Broadcast.Container>
        Content in plain div with no aspect ratio
      </Broadcast.Container>
    </Broadcast.Root>
  );
};`;

export const camera = `import { DisableVideoIcon, EnableVideoIcon } from "@livepeer/react/assets";
import * as Broadcast from "@livepeer/react/broadcast";
import { getIngest } from "@livepeer/react/external";
import { streamKey } from "./stream-key";

export default () => {
  return (
    <Broadcast.Root ingestUrl={getIngest(streamKey)}>
      <Broadcast.Video
        title="Livestream"
        style={{
          height: "100%",
          width: "100%",
          objectFit: "contain",
        }}
      />

      <Broadcast.VideoEnabledTrigger
        style={{
          position: "absolute",
          left: 20,
          bottom: 20,
          width: 25,
          height: 25,
        }}
      >
        <Broadcast.VideoEnabledIndicator asChild matcher={false}>
          <EnableVideoIcon />
        </Broadcast.VideoEnabledIndicator>
        <Broadcast.VideoEnabledIndicator asChild>
          <DisableVideoIcon />
        </Broadcast.VideoEnabledIndicator>
      </Broadcast.VideoEnabledTrigger>
    </Broadcast.Root>
  );
};`;

export const audio = `import { DisableAudioIcon, EnableAudioIcon } from "@livepeer/react/assets";
import * as Broadcast from "@livepeer/react/broadcast";
import { getIngest } from "@livepeer/react/external";
import { streamKey } from "./stream-key";

export default () => {
  return (
    <Broadcast.Root ingestUrl={getIngest(streamKey)}>
      <Broadcast.Video
        title="Livestream"
        style={{
          height: "100%",
          width: "100%",
          objectFit: "contain",
        }}
      />

      <Broadcast.AudioEnabledTrigger
        style={{
          position: "absolute",
          left: 20,
          bottom: 20,
          width: 25,
          height: 25,
        }}
      >
        <Broadcast.AudioEnabledIndicator asChild matcher={false}>
          <EnableAudioIcon />
        </Broadcast.AudioEnabledIndicator>
        <Broadcast.AudioEnabledIndicator asChild>
          <DisableAudioIcon />
        </Broadcast.AudioEnabledIndicator>
      </Broadcast.AudioEnabledTrigger>
    </Broadcast.Root>
  );
};`;
