"use client";

import * as Broadcast from "@livepeer/react/broadcast";
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
});
