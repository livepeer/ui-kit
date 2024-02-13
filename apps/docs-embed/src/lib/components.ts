export const volume = `import { MuteIcon, UnmuteIcon } from "@livepeer/react/assets";
import { getSrc } from "@livepeer/react/external";
import * as Player from "@livepeer/react/player";

import { vodSource } from "./source";

export default () => {
  return (
    <Player.Root src={getSrc(vodSource)} autoPlay>
      <Player.Video style={{ height: "100%", width: "100%" }} />
      <div
        style={{
          position: "absolute",
          left: 20,
          top: 20,
          display: "flex",
          alignItems: "center",
          gap: 10,
          width: "100%",
        }}
      >
        <Player.MuteTrigger
          style={{
            width: 25,
            height: 25,
          }}
        >
          <Player.VolumeIndicator asChild matcher={false}>
            <MuteIcon />
          </Player.VolumeIndicator>
          <Player.VolumeIndicator asChild matcher={true}>
            <UnmuteIcon />
          </Player.VolumeIndicator>
        </Player.MuteTrigger>
        <Player.Volume
          style={{
            position: "relative",
            display: "flex",
            flex: "1 1 0%",
            height: 20,
            alignItems: "center",
            maxWidth: 120,
            touchAction: "none",
            userSelect: "none",
          }}
        >
          <Player.Track
            style={{
              position: "relative",
              borderRadius: 1000,
              height: 3,
              flexGrow: 1,
              backgroundColor: "#ffffff40",
            }}
          >
            <Player.Range
              style={{
                position: "absolute",
                backgroundColor: "white",
                borderRadius: 1000,
                height: "100%",
              }}
            />
          </Player.Track>
          <Player.Thumb
            style={{
              display: "block",
              backgroundColor: "white",
              borderRadius: 1000,
              height: 10,
              width: 10,
            }}
          />
        </Player.Volume>
      </div>
    </Player.Root>
  );
};`;

export const source = `export const vodSource = {
  type: "vod",
  meta: {
    playbackPolicy: null,
    source: [
      {
        hrn: "HLS (TS)",
        type: "html5/application/vnd.apple.mpegurl",
        url: "https://lp-playback.com/hls/f5eese9wwl88k4g8/index.m3u8",
      },
    ],
  },
};`;

export const seek = `import { getSrc } from "@livepeer/react/external";
import * as Player from "@livepeer/react/player";

import { vodSource } from "./source";

export default () => {
  return (
    <Player.Root src={getSrc(vodSource)} autoPlay>
      <Player.Video style={{ height: "100%", width: "100%" }} />

      <Player.Seek
        style={{
          position: "absolute",
          left: 20,
          bottom: 20,
          display: "flex",
          alignItems: "center",
          gap: 10,
          width: "100%",
          userSelect: "none",
          touchAction: "none",
        }}
      >
        <Player.Track className="bg-white/30 relative grow rounded-full transition-all h-[2px] md:h-[3px] group-hover:h-[3px] group-hover:md:h-[4px]">
          <Player.SeekBuffer className="absolute bg-black/30 transition-all duration-1000 rounded-full h-full" />
          <Player.Range className="absolute bg-white rounded-full h-full" />
        </Player.Track>
        <Player.Thumb className="block group-hover:scale-110 w-3 h-3 bg-white transition-all rounded-full" />
      </Player.Seek>
    </Player.Root>
  );
};`;

export const rate = `import { getSrc } from "@livepeer/react/external";
import * as Player from "@livepeer/react/player";

import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { forwardRef } from "react";
import { vodSource } from "./source";

export default () => {
  return (
    <Player.Root src={getSrc(vodSource)} autoPlay volume={0}>
      <Player.Video style={{ height: "100%", width: "100%" }} />
      <Player.LiveIndicator
        style={{
          position: "absolute",
          left: 20,
          top: 20,
          display: "flex",
          alignItems: "center",
          gap: 10,
          width: "100%",
        }}
        matcher={false}
      >
        <Player.RateSelect>
          <Player.SelectTrigger
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: 12,
              gap: 5,
              padding: 10,
              borderRadius: 5,
              outline: "white solid 1px",
            }}
            aria-label="Playback speed"
          >
            <Player.SelectValue placeholder="Select a speed..." />
            <Player.SelectIcon>
              <ChevronDownIcon style={{ width: 14, height: 14 }} />
            </Player.SelectIcon>
          </Player.SelectTrigger>
          <Player.SelectPortal>
            <Player.SelectContent
              style={{
                borderRadius: 5,
                backgroundColor: "black",
              }}
            >
              <Player.SelectViewport style={{ padding: 5 }}>
                <Player.SelectGroup>
                  <RateSelectItem value={0.5}>0.5x</RateSelectItem>
                  <RateSelectItem value={1}>1x</RateSelectItem>
                </Player.SelectGroup>
              </Player.SelectViewport>
            </Player.SelectContent>
          </Player.SelectPortal>
        </Player.RateSelect>
      </Player.LiveIndicator>
    </Player.Root>
  );
};

const RateSelectItem = forwardRef<HTMLDivElement, Player.RateSelectItemProps>(
  ({ children, ...props }, forwardedRef) => {
    return (
      <Player.RateSelectItem
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
        <Player.SelectItemText>{children}</Player.SelectItemText>
        <Player.SelectItemIndicator
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
        </Player.SelectItemIndicator>
      </Player.RateSelectItem>
    );
  },
);`;

export const poster = `import { getSrc } from "@livepeer/react/external";
import * as Player from "@livepeer/react/player";

import { vodSource } from "./source";

const vodSourceWithThumbnail = {
  ...vodSource,
  meta: {
    ...vodSource.meta,
    source: [
      ...vodSource.meta.source,
      {
        hrn: "Thumbnail (JPEG)",
        type: "image/jpeg",
        url: "https://ddz4ak4pa3d19.cloudfront.net/cache/7e/01/7e013b156f34e6210e53c299b2b531f5.jpg",
      },
    ],
  },
};

export default () => {
  return (
    <Player.Root src={getSrc(vodSourceWithThumbnail)} autoPlay volume={0}>
      <Player.Video style={{ height: "100%", width: "100%" }} />
      <Player.PlayingIndicator asChild matcher={false}>
        <Player.Poster
          style={{
            position: "absolute",
            inset: 0,
          }}
        />
      </Player.PlayingIndicator>
    </Player.Root>
  );
};`;

export const play = `import { getSrc } from "@livepeer/react/external";
import * as Player from "@livepeer/react/player";

import { PauseIcon, PlayIcon } from "@livepeer/react/assets";
import { vodSource } from "./source";

export default () => {
  return (
    <Player.Root src={getSrc(vodSource)}>
      <Player.Video style={{ height: "100%", width: "100%" }} />
      <Player.PlayPauseTrigger
        style={{
          position: "absolute",
          left: 20,
          bottom: 20,
          width: 25,
          height: 25,
        }}
      >
        <Player.PlayingIndicator asChild matcher={false}>
          <PlayIcon />
        </Player.PlayingIndicator>
        <Player.PlayingIndicator asChild>
          <PauseIcon />
        </Player.PlayingIndicator>
      </Player.PlayPauseTrigger>
    </Player.Root>
  );
};`;

export const live = `import { getSrc } from "@livepeer/react/external";
import * as Player from "@livepeer/react/player";

import { vodSource } from "./source";

export default () => {
  return (
    <Player.Root src={getSrc(vodSource)} autoPlay volume={0}>
      <Player.Video style={{ height: "100%", width: "100%" }} />
      <Player.LiveIndicator
        matcher={false}
        style={{
          position: "absolute",
          left: 20,
          top: 20,
        }}
      >
        STATIC ASSET
      </Player.LiveIndicator>
    </Player.Root>
  );
};`;

export const controls = `import { getSrc } from "@livepeer/react/external";
import * as Player from "@livepeer/react/player";

import { vodSource } from "./source";

export default () => {
  return (
    <Player.Root src={getSrc(vodSource)} autoPlay volume={0}>
      <Player.Video style={{ height: "100%", width: "100%" }} />

      <Player.Controls autoHide={5000}>
        Auto-hidden controls container
      </Player.Controls>
    </Player.Root>
  );
};`;

export const clip = `import { ClipIcon } from "@livepeer/react/assets";
import { getSrc } from "@livepeer/react/external";
import * as Player from "@livepeer/react/player";

import { toast } from "sonner";
import { vodSource } from "./source";

export default () => {
  return (
    <Player.Root src={getSrc(vodSource)} autoPlay volume={0} clipLength={30}>
      <Player.Video style={{ height: "100%", width: "100%" }} />
      <Player.LiveIndicator asChild>
        <Player.ClipTrigger
          style={{
            position: "absolute",
            right: 20,
            bottom: 20,
          }}
          onClip={({ playbackId, startTime, endTime }) => {
            toast(\`Clip request for \${playbackId}\`, {
              description: \`The requested clip is from \${startTime} to \${endTime}\`,
            });
          }}
        >
          <ClipIcon style={{ width: 20, height: 20 }} />
        </Player.ClipTrigger>
      </Player.LiveIndicator>
    </Player.Root>
  );
};`;

export const code = `import { cn } from "@/lib/utils";
import "./shiki.css";

export const ExpandableCode = ({ code }: { code: string }) => {
  return (
    <div
      className={cn("flex flex-col relative overflow-hidden")}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
      dangerouslySetInnerHTML={{
        __html: code,
      }}
    />
  );
};`;

export const code_server = `import * as components from "@/lib/components";
import { codeToHtml } from "@/lib/shiki";
import { notFound } from "next/navigation";
import { ExpandableCode } from "./code";

export type ComponentKey = keyof typeof components;

export const CodeWithExampleServer = async ({
  example,
  component,
}: { example: React.ReactNode; component: ComponentKey }) => {
  const stringComponent = components[component];

  if (!stringComponent) {
    notFound();
  }

  const result = await codeToHtml({
    code: components[component],
  });

  return (
    <div className="flex flex-col rounded-lg">
      <div className="relative flex w-full min-h-[300px] items-center justify-center overflow-hidden">
        {example}
      </div>
      <ExpandableCode code={result} />
    </div>
  );
};`;
