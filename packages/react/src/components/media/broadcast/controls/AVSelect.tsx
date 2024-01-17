import { styling } from "@livepeer/core-web/media/browser/styling";
import * as Select from "@radix-ui/react-select";
import { useMemo } from "react";

export type AVSelectProps = {
  value: string | undefined;
  onChange: (value: string) => void;
  type: "audio" | "video";
  mediaDevices: MediaDeviceInfo[];
  portalContainer: HTMLElement | null | undefined;
};

export const AVSelect = ({
  value,
  onChange,
  type,
  portalContainer,
  mediaDevices,
}: AVSelectProps) => {
  const screenshareId = useMemo(() => {
    if (
      value &&
      mediaDevices.every((mediaDevice) => value !== mediaDevice.deviceId)
    ) {
      const splitValue = value.split(":", 2);

      const newValue =
        splitValue.length > 1
          ? `${splitValue[0]?.slice(0, 10)}...${value.slice(-4)}`
          : value.slice(0, 8);

      return newValue ?? "screen";
    }

    return null;
  }, [mediaDevices, value]);

  return (
    <div className={styling.settings.select.group()}>
      <label
        className={styling.settings.select.label()}
        htmlFor={type === "audio" ? "audio-source" : "video-source"}
      >
        {type === "audio" ? "Audio Source" : "Video Source"}
      </label>
      <Select.Root
        disabled={mediaDevices.length === 0}
        value={value}
        onValueChange={onChange}
        name={type === "audio" ? "audio-source" : "video-source"}
      >
        <Select.Trigger
          className={styling.settings.select.trigger()}
          aria-label={type === "audio" ? "Audio Source" : "Video Source"}
        >
          <Select.Value
            placeholder={
              type === "audio"
                ? "Select your audio source..."
                : "Select your video source..."
            }
          />
          <Select.Icon className={styling.settings.select.icon()}>
            <ChevronDownIcon />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal container={portalContainer}>
          <Select.Content className={styling.settings.select.content()}>
            <Select.Viewport className={styling.settings.select.viewport()}>
              <Select.Group>
                {mediaDevices.map((mediaDevice, i) => (
                  <Select.Item
                    key={mediaDevice.deviceId}
                    value={mediaDevice.deviceId}
                    className={styling.settings.select.item()}
                  >
                    <Select.ItemText>
                      {mediaDevice.label ??
                        `${
                          type === "audio" ? `Audio Source` : `Video Source`
                        } ${i + 1} (${
                          mediaDevice.deviceId === "default"
                            ? "default"
                            : mediaDevice.deviceId.slice(0, 6)
                        })`}
                    </Select.ItemText>
                    <Select.ItemIndicator
                      className={styling.settings.select.itemIndicator()}
                    >
                      <SelectedIcon />
                    </Select.ItemIndicator>
                  </Select.Item>
                ))}
                {value && screenshareId && (
                  <Select.Item
                    key={value}
                    value={value}
                    className={styling.settings.select.item()}
                  >
                    <Select.ItemText>{`Screen Source (${screenshareId})`}</Select.ItemText>
                    <Select.ItemIndicator
                      className={styling.settings.select.itemIndicator()}
                    >
                      <SelectedIcon />
                    </Select.ItemIndicator>
                  </Select.Item>
                )}
              </Select.Group>
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
};

const ChevronDownIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="20"
    viewBox="0 -960 960 960"
    width="20"
  >
    <path
      fill="currentColor"
      d="M480-345 240-585l43-43 197 198 197-197 43 43-240 239Z"
    />
  </svg>
);

const SelectedIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="16"
    viewBox="0 -960 960 960"
    width="16"
  >
    <path d="M378-246 154-470l43-43 181 181 384-384 43 43-427 427Z" />
  </svg>
);
