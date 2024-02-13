"use client";

import { getSrc } from "@livepeer/react/external";
import * as Player from "@livepeer/react/player";

import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { forwardRef } from "react";
import { vodSource } from "./source";

export default () => {
  return (
    <Player.Root src={getSrc(vodSource)} autoPlay volume={0}>
      <Player.Container>
        <Player.Video
          title="Agent 327"
          style={{ height: "100%", width: "100%" }}
        />

        <Player.VideoQualitySelect name="qualitySelect">
          <Player.SelectTrigger
            style={{
              position: "absolute",
              left: 20,
              bottom: 20,
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
            aria-label="Playback quality"
          >
            <Player.SelectValue placeholder="Select a quality..." />
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
                  <VideoQualitySelectItem value="auto">
                    Auto (HD+)
                  </VideoQualitySelectItem>
                  <VideoQualitySelectItem value="1080p">
                    1080p (HD)
                  </VideoQualitySelectItem>
                  <VideoQualitySelectItem value="360p">
                    360p
                  </VideoQualitySelectItem>
                </Player.SelectGroup>
              </Player.SelectViewport>
            </Player.SelectContent>
          </Player.SelectPortal>
        </Player.VideoQualitySelect>
      </Player.Container>
    </Player.Root>
  );
};

const VideoQualitySelectItem = forwardRef<
  HTMLDivElement,
  Player.VideoQualitySelectItemProps
>(({ children, ...props }, forwardedRef) => {
  return (
    <Player.VideoQualitySelectItem
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
    </Player.VideoQualitySelectItem>
  );
});
