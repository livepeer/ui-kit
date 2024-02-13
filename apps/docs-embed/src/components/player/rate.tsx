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
        <Player.LiveIndicator
          style={{
            position: "absolute",
            left: 20,
            bottom: 20,
            display: "flex",
            alignItems: "center",
            gap: 10,
            width: "100%",
          }}
          matcher={false}
        >
          <Player.RateSelect name="rateSelect">
            <Player.SelectTrigger
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                height: 30,
                minWidth: 120,
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
      </Player.Container>
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
);
